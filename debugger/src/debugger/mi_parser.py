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
        self._current_token=next(self._current_record_iter)
        

    def expect(self,expected: list|str):
        if self._current_token==expected or self._current_token in expected:
            self.advance()
        #else:
        #    raise MIParserError
    

    def parse_result_record(self):
        token= self.parse_token()
        self.expect("^")
        kind=self.parse_result_class()

        results=None
        if self._current_token==",":
            self.advance()            
            results=self.parse_results()   #na
        
        return Result(token=token,kind=kind,results=results)

            

    def parse_token(self):
        token=[]
        while self._current_token is not None and self._current_token.isdigit():
            token.append(self._current_token)
            self.advance()
        
        return int("".join(token))


    def parse_result_class(self):
        kind=[]
        print(self._current_token)
        while self._current_token is not None and self._current_token.isalpha():
            kind.append(self._current_token)
            self.advance()
        
        #if not kind:
            #raise MIParserError
        

        return "".join(kind)
    
    def parse_results(self):  #na
        pass

        


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

    parse=MIParser(text)

    #print(parse._current_record)
    parse.advance_sequence()
    print(parse._current_record,parse._current_token)
    temp=parse.parse_result_record()
    print(temp.token,temp.kind,temp.results)
    #or i in parse._records:
    #    print(i)
    #print(iter(new_text.splitlines()))
    #print(text,type(text))
