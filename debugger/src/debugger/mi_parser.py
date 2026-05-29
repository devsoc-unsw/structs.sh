from dataclasses import dataclass

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


class MIParserError(Exception):
    pass

class MIParser():
    def __init__(self, text:str):
        self.text=text
        self.split_text=self.text.split("\n(gdb) \n")
        self._sequences=iter([i.splitlines() for i in self.split_text])
        self.advance_sequence()
    
    def advance_sequence(self):
        self._current_sequence=next(self._sequences)
        self._current_sequence_iter=iter(self._current_sequence)
        self.advance_record()

    def advance_record(self):
        self._current_record=next(self._current_sequence_iter)
        self._current_record_iter=iter(self._current_record)
        self.advance()

    def advance(self):
        self._current_token=next(self._current_record_iter,None)
        

    def expect(self,expected: list|str):
        if self._current_token==expected or self._current_token in expected:
            self.advance()
        #else:
        #    raise MIParserError
    

    def parse_result_record(self):
        token= self.parse_token() if self._current_token!="^" else ""
        self.expect("^")
        kind=self.parse_result_class()

        results=dict()
        while self._current_token==",":
            self.advance()            
            results.update(self.parse_result())   #na
        
        return Result(token=token,kind=kind,results=results)

            

    def parse_token(self):
        token=[]
        while self._current_token is not None and self._current_token.isdigit():
            token.append(self._current_token)
            self.advance()
        
        return int("".join(token)) if token else None


    def parse_result_class(self):
        kind=[]
        print(self._current_token)
        while self._current_token is not None and self._current_token.isalpha():
            kind.append(self._current_token)
            self.advance()
        
        #if not kind:
            #raise MIParserError
        

        return "".join(kind)
    
    def parse_result(self):  #na
        key=[]

        while self._current_token.isalpha() or self._current_token in ["_","-"]:
            key.append(self._current_token)
            self.advance()
        
        self.expect("=")
        value=self.parse_values()
        variable="".join(key)
        print(self._current_token)

        return {variable:value}
    


    def parse_values(self):
        temp_value=None
        match self._current_token:
            case "[":
                #self.expect("[")
                temp_value=self.parse_list()
            case "{":
                temp_value=self.parse_tuple()
            case "\"":
                temp_value=self.parse_cstring()
            case _:
                raise MIParserError
            
        return temp_value
            
                         
        
    def parse_list(self):
        self.expect("[")
        value_list=[]
        match self._current_token:
            case "]":
                self.expect("]")
                return value_list
            case "[" | "\"" | "{":
                value_list.append(self.parse_values())
                while self._current_token==",":
                    self.expect(",")
                    value_list.append(self.parse_values())
            case _:
                value_list.append(self.parse_result())
                while self._current_token==",":
                    self.expect(",")
                    value_list.append(self.parse_result())

        self.expect("]")        

        return value_list

    # variable=[var:val,var1:[var2:val2]]
                    

    def parse_tuple(self):
        self.expect("{")
        value_tuple={}
        match self._current_token:
            case "}":
                self.expect("}")
                return value_tuple
            case _:
                value_tuple.update(self.parse_result())
                while self._current_token==",":
                    self.expect(",")
                    value_tuple.update(self.parse_result())
        
        self.expect("}")
        return value_tuple

    def parse_cstring(self):
        self.expect("\"")
        cstring=[]
        while self._current_token!="\"":
            cstring.append(self._current_token)
            self.advance()
        self.expect("\"")
        return "".join(cstring)
    
    def parse_ofb_record(self):
        match self._current_token:
            case "~" | "@" | "&":
                return self.parse_stream_record()
            case _:
                return self.parse_async_record()
        

    def parse_async_record(self):
        token=self.parse_token()
        match self._current_token:
            case "*":
                self.expect("*")
                kind,output=self.parse_async_output()
                return ExecAsync(token=token,kind=kind,output=output)
            case "+":
                self.expect("+")
                kind,output=self.parse_async_output()
                return StatusAsync(token=token,kind=kind,output=output)
            case "=":
                self.expect("=")
                kind,output=self.parse_async_output()
                return NotifyAsync(token=token,kind=kind,output=output)
            case _:
                raise MIParserError

    def parse_stream_record(self):
        msg=None
        match self._current_token:
            case "~":
                self.expect("~")
                msg=self.parse_cstring()
                return ConsoleStream(msg=msg)
            case "@":
                self.expect("@")
                msg=self.parse_cstring()
                return TargetStream(msg=msg)
            case "&":
                self.expect("&")
                msg=self.parse_cstring()
                return LogStream(msg=msg)
            case _:
                raise MIParserError   

   
    def parse_async_output(self):
        async_class=self.parse_async_class()
        output={}
        
        while self._current_token==",":
            self.expect(",")
            output.update(self.parse_result())
        
        return async_class,output

    def parse_async_class(self):
        async_class=[]
        while self._current_token.isalpha() or self._current_token in ["_","-"]:
            async_class.append(self._current_token)
            self.advance()

        return "".join(async_class)

    
      

if __name__=="__main__":
    from textwrap import dedent

    text = (
        dedent(
            r"""
            12^done,stack=[frame={level="0",addr="0x0000555555555169",func="fibonacci",file="test_fibonacci.c",fullname="/app/src/debugger/test/test_fibonacci.c",line="6"},frame={level="1",addr="0x00005555555551f0",func="main",file="test_fibonacci.c",fullname="/app/src/debugger/test/test_fibonacci.c",line="16"}]
            (gdb) 
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
            """
        )
        .lstrip()
        #.encode()
    )
    #new_text=text.split("\n(gdb) \n")
    #print(new_text,"\n")
    #print(text)

    parse=MIParser(text)

    #print(parse._current_record)
    parse.advance_sequence()
    parse.advance_sequence()
    parse.advance_sequence()
    parse.advance_record()
    parse.advance_record()
    parse.advance_record()
    parse.advance_record()
    print(parse._current_record,parse._current_token)
    temp=parse.parse_ofb_record()
    #print(temp.token,temp.kind,temp.output)
    print(temp,temp.msg)
    #or i in parse._records:
    #    print(i)
    #print(iter(new_text.splitlines()))
    #print(text,type(text))
