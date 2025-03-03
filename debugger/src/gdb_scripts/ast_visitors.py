from pycparser import c_ast
from typing import List, TypedDict

class Decl(TypedDict):
    name: str
    typeName: any ## TODO

class DeclVisitor(c_ast.NodeVisitor):

    def __init__(self, name, file, line_num, original_line) -> None:
        super().__init__()
        self.name = name
        self.file = file
        self.line_num = line_num
        self.original_line = original_line

    def visit_FuncDecl(self, node):
        '''
        Gives return_type and params
        Example:
        For this function declaration in C:

            int myfunc(struct node a, char* b);

        returns:
        {`
            "params": [
                {
                    "name": "a",
                    "typeName": "struct node",
                },
                {
                    "name": "b",
                    "typeName": "char*",
                },
            ],
            "return_type": "int"
        }`
        '''
        result = {}
        result['return_type'] = self.visit(node.type)
        if node.args is not None:
            result['params'] = self.visit(node.args)
        else:
            result['params'] = []

        return result

    def constructInfo(self, node):
        '''
        Expect isinstance(node, c_ast.Decl) and isinstance(node.type, c_ast.FuncDecl)
        '''
        result = {}
        result["name"] = self.name
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line

        parseResult = self.visit(node.type)
        result.update(parseResult)

        return result

    def visit_Decl(self, node):
        result = {}
        result['name'] = node.name
        if isinstance(node.type, c_ast.FuncDecl):
            result['typeName'] = self.visit(node.type)
        elif isinstance(node.type, c_ast.TypeDecl):
            result['typeName'] = self.visit(node.type)
        elif isinstance(node.type, c_ast.PtrDecl):
            result['typeName'] = self.visit(node.type)
        elif isinstance(node.type, c_ast.ArrayDecl):
            result['typeName'] = self.visit(node.type)
        else:
            raise Exception(
                f"Visiting Decl of unknown type: {type(node).__name__}")

        return result

    def visit_ParamList(self, node):
        result = []

        for param in node.params:
            result.append(self.visit(param))

        return result

    def visit_Typename(self, node):
        result = {}
        result["name"] = node.name
        result["typeName"] = self.visit(node.type)
        return result

    def visit_TypeDecl(self, node):
        if isinstance(node.type, c_ast.Decl):
            return self.visit(node.type)
        elif isinstance(node.type, c_ast.Struct):
            return self.visit(node.type)
        elif isinstance(node.type, c_ast.IdentifierType):
            return self.visit(node.type)
        else:
            raise Exception(
                f"Visiting TypeDecl with unknown type: {type(node.type).__name__}")

    def visit_Struct(self, node):
        return f"struct {node.name}"

    def visit_PtrDecl(self, node):
        return f"{self.visit(node.type)}*"

    def visit_ArrayDecl(self, node):
        # return f"{self.visit(node.type)}[{node.dim.value if node.dim else ''}]"
        return f"{self.visit(node.type)}[]"

    def visit_IdentifierType(self, node):
        return " ".join(node.names)

class FuncDeclInfo(TypedDict):
    name: str
    file: str
    line_num: int
    original_line: str
    params: List[any] ## TODO
    return_type: str

class ParseFuncDeclVisitor(DeclVisitor):
    '''
    Visitor pattern for parsing function declarations.
    Returns a dict in the following form:
    {
        "name": "myFunc",
        "func_decl": {
            "return_type": "int",
            "params": [
                {
                    "type": "int",
                    "name": "a" ## Might be None
                },
                {
                    "type": "char * *",
                    "name": "b"
                },
                {
                    "type": "struct node *",
                    "name": "b"
                },
                {
                    "type": "List *",
                    "name": "b"
                },
                ...
            ]
        }
    }'''

    def constructInfo(self, node: c_ast.Decl) -> FuncDeclInfo:
        '''
        Expect isinstance(node, c_ast.Decl) and isinstance(node.type, c_ast.FuncDecl)
        '''
        result: FuncDeclInfo = {}
        result["name"] = self.name
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line

        parseResult = self.visit(node.type)
        result.update(parseResult)

        return result

class TypeInfo(TypedDict):
    typeName: any ## TODO: figure out what typehint this should be

class TypeDeclInfo(TypedDict):
    typeName: str ## TODO: inconsistent, should be named "name"?
    file: str
    line_num: int
    original_line: str
    type: TypeInfo

class ParseTypeDeclVisitor(DeclVisitor):

    def constructInfo(self, node) -> TypeDeclInfo:
        '''
        Expect isinstance(node, c_ast.Decl) or isinstance(node.type, c_ast.TypeDef)
        '''
        result: TypeDeclInfo = {}
        result["typeName"] = self.name
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line

        parseResult = self.visit(node.type)
        result['type'] = {'typeName': parseResult}

        return result


class FieldInfo(TypedDict):
    ## TODO
    pass

class StructInfo(TypedDict):
    typeName: str ## TODO: inconsistent, should be named "name"?
    file: str
    line_num: int
    original_line: str
    fields: List[FieldInfo]

class ParseStructDefVisitor(DeclVisitor):

    def constructInfo(self, node: c_ast.Struct) -> StructInfo:
        '''
        Expect isinstance(node, c_ast.Struct)
        '''
        result: StructInfo = {}
        result["typeName"] = f"struct {self.name}"
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line
        result['fields'] = []

        for decl in node.decls:
            parseResult = self.visit(decl)
            result['fields'].append(parseResult)

        return result
