from array import array
from dataclasses import dataclass
from itertools import islice, pairwise
from re import match, sub
from typing import assert_never

import orjson

fastdataclass = lambda c: dataclass(
    repr=False,
    eq=False,
    order=False,
    frozen=True,
    match_args=False,
    kw_only=True,
    slots=True,
    weakref_slot=False,
)(c)


@fastdataclass
class Result:
    token: int
    kind: str
    results: dict


@fastdataclass
class ExecAsync:
    token: int | None
    kind: str
    output: dict


@fastdataclass
class StatusAsync:
    token: int | None
    kind: str
    output: dict


@fastdataclass
class NotifyAsync:
    token: int | None
    kind: str
    output: dict


@fastdataclass
class ConsoleStream:
    msg: str


@fastdataclass
class TargetStream:
    msg: str


@fastdataclass
class LogStream:
    msg: str


def parse(text: bytes):
    for line in text.splitlines():
        if line == b"(gdb) ":
            continue

        line = line.decode()

        m = match("[0-9]*", line)
        token = int(line[: m.end()]) if m.end() else None
        match line[m.end()]:
            case "^":
                m = match(r"[0-9]*.([a-z\-]+)", line)
                kind = m.group(1)
                yield Result(
                    token=token,
                    kind=kind,
                    results=obj(line[m.end(1) + 1 :]),
                )
            case "*":
                m = match(r"[0-9]*.([a-z\-]+)", line)
                kind = m.group(1)
                yield ExecAsync(
                    token=token,
                    kind=kind,
                    output=obj(line[m.end(1) + 1 :]),
                )
            case "+":
                m = match(r"[0-9]*.([a-z\-]+)", line)
                kind = m.group(1)
                yield StatusAsync(
                    token=token,
                    kind=kind,
                    output=obj(line[m.end(1) + 1 :]),
                )
            case "=":
                m = match(r"[0-9]*.([a-z\-]+)", line)
                kind = m.group(1)
                yield NotifyAsync(
                    token=token,
                    kind=kind,
                    output=obj(line[m.end(1) + 1 :]),
                )

            case "~":
                yield ConsoleStream(msg=c_str(line[m.end() + 1 :]))
            case "@":
                yield TargetStream(msg=c_str(line[m.end() + 1 :]))
            case "&":
                yield LogStream(msg=c_str(line[m.end() + 1 :]))
            case _:
                assert_never(line[m.end()])


def obj(text: str):
    text = _translate_octal_escapes(text)
    text = _delete_list_keys(text)
    text = _translate_tuple_keys(text)
    return orjson.loads(f"{{{text}}}")


def c_str(text: memoryview):
    text = _translate_octal_escapes(text)
    return orjson.loads(text)


def parse_c_value(text: str) -> any:
    text = _translate_octal_escapes(text)
    text = _delete_list_keys(text)
    text = _del_value_aliases(text)
    text = _translate_struct_keys(text)
    text = _stringify_addresses(text)
    if text[:1] == "{":
        text = _translate_list_braces(text)
    return orjson.loads(text)


def _delete_list_keys(text: str):
    out = array("w", text)
    o = 1
    stack = array("w", ["{"])

    for p, c in pairwise(text):
        if p != "\\":
            if stack[-1] == '"':
                if c == '"':
                    stack.pop()
            else:
                match c:
                    case '"':
                        stack.append('"')
                    case "{":
                        stack.append("{")
                    case "}":
                        assert stack.pop() == "{"
                    case "[":
                        stack.append("[")
                    case "]":
                        assert stack.pop() == "["

        if c == "=" and stack[-1] == "[":
            while out[o - 1] != "," and out[o - 1] != "[":
                o -= 1
        else:
            out[o] = c
            o += 1

    return "".join(islice(out, 0, o))


def _translate_octal_escapes(text: str):
    return sub(
        r"\\([0-7]{1,3})",
        lambda m: rf"\u{(int(m.group(1), 8)):04x}",
        text,
    )


def _translate_tuple_keys(text: str):
    return sub(r"([a-zA-Z\-_]+)=", r'"\1":', text)


def _translate_struct_keys(text: str):
    return sub(r"([a-zA-Z\-_]+) = ", r'"\1":', text)


def _del_value_aliases(text: str):
    return sub(r"([0-9]+|0x[0-9a-fA-F]+) ('[^']+'|<[^>]+>)", r"\1", text)


def _stringify_addresses(text: str):
    return sub(r"(0x[0-9a-fA-F]{1,16})", r'"\1"', text)


# def _translate_octal_ints(text: str):
#     return sub(r'"(0[0-7]+)"', lambda m: f"{int(m.group(1), 8)}", text)


def _translate_list_braces(text: str):
    out = array("w", text)
    stack = array("w")
    for i, c in enumerate(text):
        if text[i - 1 : i] == "\\":
            continue

        if '"' in stack[-1:]:
            if c == '"':
                stack.pop()
            continue

        match c:
            case '"':
                stack.append('"')
            case "{" if text[i + 1 : i + 2] != '"':
                stack.append("[")
                out[i] = "["
            case "{":
                stack.append("{")
            case "}":
                br = stack.pop()
                assert br == "{" or br == "["
                if br == "[":
                    out[i] = "]"

    return "".join(out)


if __debug__ and __name__ == "__main__":
    from pprint import pp
    from textwrap import dedent

    text = (
        dedent(
            r"""
            10^done,__aaabada__=[x="1",x="2",x=[[["\\asdf\"1\u0000\011'"]]]]
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
