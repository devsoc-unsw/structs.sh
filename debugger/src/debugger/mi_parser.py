from dataclasses import dataclass
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


class MIParserError(Exception):
    pass

class CursorParser():
    def __init__(self, text:str):
        self.text=text.strip()
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
        self._pos=-1
        self.advance()

    def advance(self):
        self._current_token=next(self._current_record_iter,None)
        self._pos+=1
        

    def expect(self,expected: list|str):
        if self._current_token==expected or self._current_token in expected:
            self.advance()
        else:
            raise MIParserError


class MIParser(CursorParser):
    def parse(self):
        while self._current_sequence and self._current_record:
            token= self.parse_token() if self._current_token and self._current_token.isdigit() else None
            match self._current_token:
                case "^":
                    yield self.parse_result_record(token)
                case _:
                    yield self.parse_ofb_record(token)
            try:
                self.advance_record()
            except StopIteration:
                try:
                    self.advance_sequence()
                except StopIteration:
                    break

    def parse_result_record(self, token: str):
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
        while self._current_token is not None and self._current_token.isalpha():
            kind.append(self._current_token)
            self.advance()
        
        if not kind:
            raise MIParserError
        

        return "".join(kind)
    
    def parse_result(self):  
        key=[]

        while self._current_token.isalpha() or self._current_token in ["_","-"]:
            key.append(self._current_token)
            self.advance()
        
        self.expect("=")
        value=self.parse_values()
        variable="".join(key)

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
                value_list.extend(self.parse_result().values())
                while self._current_token==",":
                    self.expect(",")
                    value_list.extend(self.parse_result().values())

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
        escape=False
        cstring=[]
        while self._current_token:
            if escape is False and self._current_token=="\"":
                break

            if escape:
                oct_str=[]
                cnt=0
                while cnt<3:
                    if self._current_token.isdigit() and 0<=int(self._current_token)<=7:
                        oct_str.append(self._current_token)
                        self.advance()
                    else:
                        break
                    cnt+=1
                
                if cnt>0:
                    cstring.append("u")
                    oct_str=int("".join(oct_str),8)
                    hex_str=f"{oct_str:04x}"
                    cstring.extend(list(hex_str))
                    
                    escape=False    
                    continue      

            if self._current_token=="\\":
                escape=True
            else:
                escape=False 
                          
            cstring.append(self._current_token)
            self.advance()
     
        
        self.expect("\"")
        return orjson.loads('"'+"".join(cstring)+'"')



    def parse_ofb_record(self, token: str):
        match self._current_token:
            case "~" | "@" | "&":
                return self.parse_stream_record()
            case _:
                return self.parse_async_record(token)
        

    def parse_async_record(self,token: str):
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


class CValueParser(CursorParser):
#     #"{data = 5, next = 0x0}"


    def parse_cvalue(self):
        
        match self._current_token:
            case t if t=="{":
                print("ss",self._current_token,self._pos)
                self.expect("{")
                is_struct=self.lookahead_is_struct()
                print(is_struct,self._current_token,self._pos)
                if not is_struct:
                    results=[]
                    results.append(self.parse_cvalue())
                    while self._current_token==",":
                        self.advance()
                        self.expect(" ")
                        results.append(self.parse_cvalue())
                else:
                    results=dict()
                    results.update(self.parse_cvalues_struct())
                    while self._current_token==",":
                        self.advance()
                        self.expect(" ")
                        results.update(self.parse_cvalues_struct())

                self.expect("}")
                return results

            case t if t.isdigit():
                alias=False
                is_addr=False
                sub_val=[]
                while self._current_token!="," and self._current_token!="}" and self._current_token!=None:
                    if self._current_token==" ":
                        alias=True
                    
                    if alias:
                        self.advance()
                        continue

                    if self._current_token.isalpha():
                        is_addr=True                   

                    sub_val.append(self._current_token)
                    self.advance()

                if is_addr:
                    return "".join(sub_val)
                else:
                    return int("".join(sub_val))  
                    
            case t if t.isalpha():
                sub_str=[]
                while self._current_token!="," or self._current_token=="}" or self._current_token==None:
                    sub_str.append(self._current_token)
                    self.advance()    
                return "".join("".join(sub_str))
            
            case _:
                raise MIParserError(f"Unaddressed cvalue string: {text}")

    def parse_cvalues_struct(self):
        key=[]

        while self._current_token!=" ":
            if self._current_record==",":
                is_list=True
                break
    
            key.append(self._current_token)
            self.advance()
        
        self.expect(" ")
        self.expect("=")
        self.expect(" ")

        value=self.parse_cvalue()
        key="".join(key)
        
        return {key:value}
        
    def lookahead_is_struct(self) -> bool:
        i = self._pos+1
        while i < len(self._current_record):
            c = self._current_record[i]
            if c == '=':
                return True
            if c in (',', '}', '{'):
                return False
            i += 1
        return False



      

if __name__=="__main__":
    from textwrap import dedent

    text = (
        dedent(
            r"""
            @"hehehhhehe\u0000\011\n"
            ~"helloooo~!\n"
            ~"\\asdf\"1\u0000\011'"
            &"INFO:1337"
            12^done,stack=[frame={level="0",addr="0x0000555555555169",func="fibonacci",file="test_fibonacci.c",fullname="/app/src/debugger/test/test_fibonacci.c",line="6"},frame={level="1",addr="0x00005555555551f0",func="main",file="test_fibonacci.c",fullname="/app/src/debugger/test/test_fibonacci.c",line="16"}]
            10^done,__aaabada__=[x="1",x="2",x=[[["\\asdf\"1\u0000\011'"]]]]
            13^done,a=[b=[[c="2"],[d="3"]]]
            0011111^running,_="\012h'e\u0000\tl\"lo!"
            (gdb) 
            10^done,__aaabada__=[x="1",x="2",x=[[["\\asdf\"1\u0000\011'"]]]]
            (gdb) 
            10^done,x={main="0x0",crimson="\"\"]}"},y="zzz"
            1+stopped,y={}
            2*stopped,z={}
            3=stopped,w={}            
            (gdb) 
            ~"what\012"
            (gdb) 
            """)
        .lstrip()
        #.encode()
    )

    text1=(dedent(r"""
                  {"value": "{data = 5, next = 0x0}"}
                  """)
                  .lstrip()
    )

    parse1=MIParser(text)
    parse2=MIParser(text1)

    # temp1=parse1.parse()    
    # for i in temp1:
    #     if isinstance(i,Result):
    #         print(i)
    #         print(i.token,i.kind,i.results)
    #     elif not isinstance(i,ConsoleStream) and not isinstance(i,LogStream) and not isinstance(i,TargetStream) and not isinstance(i,Result):
    #         print(i)
    #         print(i.token,i.kind,i.output)
    #     elif isinstance(i,ConsoleStream) or isinstance(i,LogStream) or isinstance(i,TargetStream):
    #         print(i)
    #         print(i.msg)
    
    text="""10^done,value="{point = {x = 1, y = 2}, arr = {10, 20}, chk = {{x = 10, y = 20}, {x = 30, y = 40}, {x = 50, y = 60}}, ptr = 0x5555555592a0 ', ch = 101 'e'}" """.strip(" ")
    value=MIParser(text).parse()
    value=next(value).results['value']
    print(value)
    cparser=CValueParser(value)
    print(cparser._current_token)
    ans=cparser.parse_cvalue()
    print(type(ans),ans)   
    #print(parse_cvalue("\"{[0] = 10, [1] = 20}\""))    