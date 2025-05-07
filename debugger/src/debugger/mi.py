from textwrap import dedent
from lark import Lark, Transformer
from pydantic import BaseModel

grammar = r"""
    ?start: lines
    
    lines: line*
    line: (_out_of_band_record | result_record | PROMPT) NL
    PROMPT: "(GDB)"
    NL: "\r" | "\n" | "\r\n"
    
    result_record: TN "^" rc comma_results
    rc: "done" -> done
      | "running" -> running
      | "connected" -> connected
      | "error" -> error
      | "exit" -> exit
    
    _out_of_band_record: _async_record | _stream_record
    
    _async_record: exec_async_output | status_async_output | notify_async_output
    exec_async_output: TN "+" "stopped" comma_results
    status_async_output: TN "*" "stopped" comma_results
    notify_async_output: TN "=" "stopped" comma_results
    
    _stream_record: console_stream_output | target_stream_output | log_stream_output
    console_stream_output: "~" C_STR
    target_stream_output: "@" C_STR
    log_stream_output: "&" C_STR
    
    TN: /[0-9]+/
    comma_results: ("," result)*

    result: KEY "=" _value
    KEY: /[_a-zA_Z][_a-zA_Z\d]*/
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
    status: str
    results: dict


class ExecAsync(Record):
    token: int
    output: dict


class StatusAsync(Record):
    token: int
    output: dict


class NotifyAsync(Record):
    token: int
    output: dict


class ConsoleStream(Record):
    msg: str


class TargetStream(Record):
    msg: str


class LogStream(Record):
    msg: str


class Transform(Transformer):
    def lines(self, items):
        return [it for it in items if it is not None]

    def line(self, items):
        return items[0]

    def PROMPT(self, items):
        return None

    def TN(self, items):
        return int(items.value)

    def comma_results(self, items):
        return dict(items)

    def result(self, items):
        return items

    def KEY(self, items):
        return items.value.decode()

    def tuple(self, items):
        return dict(items)

    def list(self, items):
        return items

    def list_kv(self, items):
        return items[1]

    def C_STR(self, re):
        return re.value[1:-1].decode("unicode_escape")

    def result_record(self, re):
        return Result(token=re[0], status=re[1].data, results=re[2])

    def exec_async_output(self, re):
        return ExecAsync(token=re[0], output=re[1])

    def status_async_output(self, re):
        return StatusAsync(token=re[0], output=re[1])

    def notify_async_output(self, re):
        return NotifyAsync(token=re[0], output=re[1])

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
    transformer=Transform(),
    use_bytes=True,
)

if __debug__:
    from pprint import pp

    text = (
        dedent(
            r"""
            0011111^running,_="\012h\'e\u0000\U00000041\tl\"\x0alo!\U0001F928"
            (GDB)
            10^done,__aa213a__=[x="1",x="2",x=[[["\\asdf\"1\x10\u0000\011'"]]]]
            (GDB)
            10^done,x={main="0x0",crimson="\"\""},y="zzz"
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
