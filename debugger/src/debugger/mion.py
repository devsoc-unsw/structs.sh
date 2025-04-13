from re import sub
from re import fullmatch
from re import Match
from itertools import pairwise
import json

"""(GDB) MI object notation"""

RESULT = "^"
RESULT_ERROR = "error"
RESULT_CLASS = {"done", "running", "connected", RESULT_ERROR, "exit"}

EXEC_ASYNC = "*"
STATUS_ASYNC = "+"
NOTIFY_ASYNC = "="
ASYNC = {EXEC_ASYNC, STATUS_ASYNC, NOTIFY_ASYNC}

CONSOLE_STREAM = "~"
TARGET_STREAM = "@"
LOG_STREAM = "&"
STREAM = {
    CONSOLE_STREAM,
    TARGET_STREAM,
    LOG_STREAM,
}

OUT_OF_BAND = STREAM | ASYNC
OUTPUT = {RESULT} | OUT_OF_BAND


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

    result = _remove_octals(result)
    result = _remove_array_keys(result)
    result = sub(r"([a-zA-Z\-_]+)=", r'"\1":', result)  # replace kv pairs
    try:
        return json.loads(f"{{{result}}}")
    except json.JSONDecodeError:
        return json.loads(result)


def valueloads(result: str) -> any:
    """
    >>> valueloads('{v = 0x0, data = 2}')
    {'v': '0x0', 'data': 2}
    """

    result = _remove_octals(result)
    result = _remove_array_keys(result)
    result = _remove_hexnums(result)
    result = sub(r"= (\d+) '[^']+'", r"= \1", result)  # remove char aliases
    result = sub(
        r"= (\"0x[0-9a-zA-Z]+\") <[^>]+>", r"= \1", result
    )  # remove function aliases
    result = sub(r"([a-zA-Z\-_]+) =", r'"\1":', result)  # replace kv pairs
    return json.loads(result)


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


def _remove_octals(text: str) -> str:
    """
    >>> input = '\\\\000\\\\265zv'
    >>> _remove_octals(input)
    '\\\\u0000\\\\u00b5zv'
    """

    def octal_to_unicode(match: Match):
        octal = int(match.group(1), 8)
        return f"\\u{octal:04x}"

    return sub(r"\\([0-7]{1,3})", octal_to_unicode, text)


def _remove_hexnums(text: str) -> str:
    """
    >>> _remove_hexnums('0x0')
    '"0x0"'
    >>> _remove_hexnums('0xdeadbeef')
    '"0xdeadbeef"'
    """

    return sub(r"(0x[0-9a-fA-F]{1,16})", r'"\1"', text)
