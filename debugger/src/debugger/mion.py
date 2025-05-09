from dataclasses import dataclass
from itertools import islice, pairwise
from re import fullmatch, sub
from typing import assert_never

import re2
import orjson


@dataclass
class Result:
    token: int
    kind: str
    results: dict


@dataclass
class ExecAsync:
    token: int | None
    kind: str
    output: dict


@dataclass
class StatusAsync:
    token: int | None
    kind: str
    output: dict


@dataclass
class NotifyAsync:
    token: int | None
    kind: str
    output: dict


@dataclass
class ConsoleStream:
    msg: str


@dataclass
class TargetStream:
    msg: str


@dataclass
class LogStream:
    msg: str


digits_regexp: re2._Regexp = re2.compile(rb"^\d*")
kind_regexp: re2._Regexp = re2.compile(rb"^[a-z\-]+")

octal_esc_regexp: re2._Regexp = re2.compile(rb"\\([0-7]{1,3})")
octal_int_regexp: re2._Regexp = re2.compile(rb"0[0-7]+")
hex_int_regexp: re2._Regexp = re2.compile(rb"0x[0-9a-fA-F]{1,16}")
pairs_regexp: re2._Regexp = re2.compile(rb"([a-zA-Z\-_]+)=")

ascii_zero_regexp: re2._Regexp = re2.compile(b"\0+")


def parse(text: bytes):
    for line in text.splitlines():
        if line == b"(gdb) ":
            continue

        line = memoryview(line)
        l = 0

        m = digits_regexp.match(line)
        token = int(m.group()) if m.end() else None
        l += m.end()

        l += 1
        match line[l - 1]:
            case 94:  # (^)
                m = kind_regexp.match(line[l:])
                kind = m.group().tobytes().decode()
                l += m.end() + 1
                yield Result(token=token, kind=kind, results=obj(line[l:]))
            case 42:  # (*)
                m = kind_regexp.match(line[l:])
                kind = m.group().tobytes().decode()
                l += m.end() + 1
                yield ExecAsync(token=token, kind=kind, output=obj(line[l:]))
            case 43:  # (+)
                m = kind_regexp.match(line[l:])
                kind = m.group().tobytes().decode()
                l += m.end() + 1
                yield StatusAsync(token=token, kind=kind, output=obj(line[l:]))
            case 61:  # (=)
                m = kind_regexp.match(line[l:])
                kind = m.group().tobytes().decode()
                l += m.end() + 1
                yield NotifyAsync(token=token, kind=kind, output=obj(line[l:]))

            case 126:  # (~)
                yield ConsoleStream(msg=c_str(line[l:]))
            case 64:  # (@)
                yield TargetStream(msg=c_str(line[l:]))
            case 38:  # (&)
                yield LogStream(msg=c_str(line[l:]))
            case _:
                assert_never(line[l - 1])


def rm_list_keys(text: bytes) -> bytearray:
    out = bytearray(text)
    stack = bytearray([123])  # ({)

    for i, c in islice(enumerate(text), 1, None):
        if text[i - 1] != 92:  # (\)
            if stack[-1] == 34:  # (")
                if c == 34:  # (")
                    stack.pop()
            else:
                match c:
                    case 34:  # (")
                        stack.append(34)  # (")
                    case 123:  # ({)
                        stack.append(123)  # ({)
                    case 125:  # (})
                        assert stack.pop() == 123  # ({)
                    case 91:  # ([)
                        stack.append(91)  # ([)
                    case 93:  # (])
                        assert stack.pop() == 91  # ([)

        if c == 61 and stack[-1] == 91:  # (=, [)
            j = i
            while (
                97 <= text[j - 1] <= 122  # (a, z)
                or 65 <= text[j - 1] <= 90  # (A, Z)
                or text[j - 1] == 45  # (-)
                or text[j - 1] == 94  # (_)
            ):
                j -= 1
            while j <= i:
                out[j] = 0
                j += 1

    return ascii_zero_regexp.sub(b"", out)


def obj(text: memoryview):
    text = b"{" + text.tobytes() + b"}"
    text = octal_esc_regexp.sub(
        lambda m: rf"\u{(int(m.group(1), 8)):04x}".encode(), text
    )
    text = rm_list_keys(text)
    text = pairs_regexp.sub(rb'"\1":', text)
    return orjson.loads(text)


def c_str(text: memoryview):
    text = octal_esc_regexp.sub(
        lambda m: rf"\u{(int(m.group(1), 8)):04x}".encode(),
        text.tobytes(),
    )
    return orjson.loads(text)


def loads(result: str) -> any:
    """
    Parse GDB MI "result" output into a Python object

    >>> loads('key="abc"')
    {'key': 'abc'}
    >>> loads('')
    {}
    >>> loads('"abcd"')
    'abcd'
    """

    result = _remove_octal(result)
    result = _remove_array_keys(result)
    result = sub(r"([a-zA-Z\-_]+)=", r'"\1":', result)  # replace kv pairs
    try:
        return orjson.loads(f"{{{result}}}")
    except orjson.JSONDecodeError:
        return orjson.loads(result)


def valueloads(result: str) -> any:
    """
    >>> valueloads('{v = 0x0, data = 2}')
    {'v': '0x0', 'data': 2}
    """

    result = _remove_octal(result)
    result = _remove_array_keys(result)
    result = _stringify_hex(result)

    # remove char alias, eg (`x = 65 'A'` => `x = 65`)
    result = sub(r"= (\d+) '[^']+'", r"= \1", result)
    # remove function alias, eg (`x = 0x15151515 <printf>` => `x = 0x15151515``)
    result = sub(r"= (\"0x[0-9a-zA-Z]+\") <[^>]+>", r"= \1", result)
    # edit k-v equal sign, eg (`x = 15` => `x: 15`)
    result = sub(r"([a-zA-Z\-_]+) =", r'"\1":', result)
    return orjson.loads(result)


def _remove_array_keys(text: str) -> str:
    """
    >>> input = 'aaa=[bbb={ccc="0"},bbb={ccc="1"}]'
    >>> _remove_array_keys(input)
    'aaa=[{ccc="0"},{ccc="1"}]'
    """

    chars = list[str]()
    brace_stack = ["{"]
    if text:
        chars.append(text[0])

    for prev, char in pairwise(text):
        if prev != "\\" and brace_stack[-1] == '"':
            if char == '"':
                brace_stack.pop()
        elif prev != "\\":
            match char:
                case '"':
                    brace_stack.append('"')
                case "{":
                    brace_stack.append("{")
                case "}":
                    assert brace_stack[-1] == "{"
                    brace_stack.pop()
                case "[":
                    brace_stack.append("[")
                case "]":
                    assert brace_stack[-1] == "["
                    brace_stack.pop()

        if char != "=" or brace_stack[-1] != "[":
            chars.append(char)
            continue
        while fullmatch(r"[a-zA-Z\-_]", chars[-1]):
            chars.pop()
    return "".join(chars)


def _remove_octal(text: str) -> str:
    """
    >>> input = '\\\\000\\\\265zv\\\\015'
    >>> _remove_octal(input)
    '\\\\u0000\\\\u00b5zv\\\\u000d'

    >>> _remove_octal('"012"')
    '10'
    """

    # octal ints, eg (`"012"` => `10`)
    text = sub(r'"(0[0-7]+)"', lambda m: f"{int(m.group(1), 8)}", text)
    # octal bytes, eg (`\256` => `0xb5`)
    text = sub(
        r"\\([0-7]{1,3})", lambda m: f"\\u{(int(m.group(1), 8)):04x}", text
    )

    return text


def _stringify_hex(text: str) -> str:
    """
    >>> _stringify_hex('0x0')
    '"0x0"'
    >>> _stringify_hex('0xdeadbeef')
    '"0xdeadbeef"'
    """

    return sub(r"(0x[0-9a-fA-F]{1,16})", r'"\1"', text)


if __debug__ and __name__ == "__main__":
    from pprint import pp
    from textwrap import dedent

    text = (
        dedent(
            r"""
            =thread-exited,id="1",group-id="i1"
            0011111^running,_="\012h'e\u0000\tl\"lo!"
            (gdb) 
            10^done,__aaabada__=[x="1",x="2",x=[[["\\asdf\"1\u0000\011'"]]]]
            (gdb) 
            10^done,x={main="0x0",crimson="\"\"]}"},y="zzz"
            1+stopped,y={}
            2*stopped,z={}
            3=stopped,w={}
            ~"helloooo~!\n"
            @"hehehhhehe\n"
            &"INFO:1337"
            (gdb) 
            (gdb) 
            ~"what\012"
            """
        )
        .lstrip()
        .encode()
    )

    x = parse(text)
    for y in x:
        pp(y)
