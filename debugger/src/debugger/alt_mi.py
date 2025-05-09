from textwrap import dedent
from typing import assert_never
from lark import Lark, Transformer, v_args
from pydantic import BaseModel

grammar = r"""
    ?start: lines

    lines: line*
    line: (_out_of_band_record | result_record | "(gdb) ") NL
    NL: "\r" | "\n" | "\r\n"

    result_record: token RR comma_results
    RR: "^" ("done" | "running" | "connected" | "error" | "exit")

    _out_of_band_record: _async_record | _stream_record

    _async_record: exec_async_output | status_async_output | notify_async_output
    exec_async_output: token EAO comma_results
    EAO: "*" KIND
    status_async_output: token SAO comma_results
    SAO: "+" KIND
    notify_async_output: token NAO comma_results
    NAO: "=" KIND

    _stream_record: console_stream_output | target_stream_output | log_stream_output
    console_stream_output: "~" C_STR
    target_stream_output: "@" C_STR
    log_stream_output: "&" C_STR

    token: DIGITS?
    DIGITS: /[0-9]+/
    KIND: /[a-z\-]+/
    comma_results: ("," result)*

    result: KEY "=" _value
    KEY: /[_a-zA_Z][_a-zA_Z\d\-]*/
    _value: C_STR | tuple | list
    tuple: "{}" | "{" result ("," result)* "}"
    list: "[]" | "[" _value ("," _value)* "]" | "[" list_kv ("," list_kv)* "]"
    list_kv: KEY "=" _value

    C_STR: "\"" (OCT | HEX | UNI | ESC | CH)* "\""
    CH: /[^"\\]/
    OCT: "\\" O ~ 1..3
    HEX: "\\x" X ~ 2 X*
    UNI: "\\u" X ~ 4 | "\\U" X ~ 8
    ESC: "\\" /[abefnrtv\\'"?]/
    O: "0".."7"
    X: "0".."9" | "a".."f" | "A".."F"
"""


class Record(BaseModel):
    pass


class Result(Record):
    token: int
    kind: str
    results: dict


class ExecAsync(Record):
    token: int | None
    kind: str
    output: dict


class StatusAsync(Record):
    token: int | None
    kind: str
    output: dict


class NotifyAsync(Record):
    token: int | None
    kind: str
    output: dict


class ConsoleStream(Record):
    msg: str


class TargetStream(Record):
    msg: str


class LogStream(Record):
    msg: str


@v_args(inline=True)
class Transform(Transformer):
    lines = lambda self, *re: [it for it in re if it is not None]

    def line(self, first, *rest):
        return first if rest else None

    def RR(self, re):
        match re.value:
            case b"^done":
                return "done"
            case b"^running":
                return "running"
            case b"^connected":
                return "connected"
            case b"^error":
                return "error"
            case b"^exit":
                return "exit"
            case _:
                assert_never(re.value)

    _strip_decode = lambda self, re: re.value[1:].decode()
    EAO = _strip_decode
    SAO = _strip_decode
    NAO = _strip_decode

    def token(self, re=None):
        return re

    DIGITS = lambda self, re: int(re.value)
    comma_results = lambda self, *re: dict(re)

    result = lambda self, *re: re
    KEY = lambda self, re: re.value.decode()
    tuple = lambda self, *re: dict(re)
    list = lambda self, *re: re
    list_kv = lambda self, *re: re[1]

    def C_STR(self, re):
        return re.value[1:-1].decode("unicode_escape")

    def result_record(self, token, rr, comma_results):
        return Result(token=token, kind=rr, results=comma_results)

    def exec_async_output(self, token, eao, comma_results):
        return ExecAsync(token=token, kind=eao, output=comma_results)

    def status_async_output(self, token, sao, comma_results):
        return StatusAsync(token=token, kind=sao, output=comma_results)

    def notify_async_output(self, token, nao, comma_results):
        return NotifyAsync(token=token, kind=nao, output=comma_results)

    def console_stream_output(self, re):
        return ConsoleStream(msg=re[0])

    def target_stream_output(self, re):
        return TargetStream(msg=re[0])

    def log_stream_output(self, re):
        return LogStream(msg=re[0])


parser = Lark(
    grammar=grammar,
    parser="lalr",
    lexer="basic",
    propagate_positions=False,
    maybe_placeholders=False,
    keep_all_tokens=False,
    transformer=Transform(),
    use_bytes=True,
)

parse = parser.parse

if __debug__ and __name__ == "__main__":
    from pprint import pp

    text = (
        dedent(
            r"""
            =thread-exited,id="1",group-id="i1"
            0011111^running,_="\012h\'e\u0000\U00000041\tl\"\x0alo!\U0001F928"
            (gdb) 
            10^done,__aa213a__=[x="1",x="2",x=[[["\\asdf\"1\x10\u0000\011'"]]]]
            (gdb) 
            10^done,x={main="0x0",crimson="\"\"]}"},y="zzz"
            1+stopped,y={}
            2*stopped,z={}
            3=stopped,w={}
            ~"helloooo~!\n"
            @"hehehhhehe\n"
            &"INFO:1337"
            """
        )
        .lstrip()
        .encode()
    )

    x = parser.parse(text)
    pp(x)
