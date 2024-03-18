"""
Get user-defined functions in the target c files that make up
the compiled binary being debugged.

Usage:

```bash
$ cd debugger
$ python3 src/parse_functions.py
```

MUST run this script from the debugger directory due to relative paths:

This script needs to be run BEFORE starting the program
in gdb, otherwise you get strange output from the
'info functions -n' command.

The functions_str will look something like this:

```
All defined functions:

File linkedlist/linkedlist.c:
21:	void append(List *, int);
14:	struct list *new_list();
7:	struct node *new_node(int);
82:	void print_list(List *);
56:	int remove_at(List *, int);
73:	int remove_head(List *);
39:	int remove_tail(List *);

File linkedlist/main1.c:
8:	int main(int, char **);
```

See "debugger/samples/fn_declarations.c" for test function declarations

Not: pycparser does not support C comments and will fail if there are
comments in the C code. Pass the C code through a preprocessor to
remove comments before parsing with pycparser.
"""
import os
from pprint import pprint
import re
import subprocess
import gdb
from pycparser import parse_file, c_ast
from src.gdb_scripts.use_socketio_connection import enable_socketio_client_emit, useSocketIOConnection


# Parent directory of this python script e.g. "/user/.../debugger/src/gdb_scripts"
# In the docker container this will be "/app/src/gdb_scripts"
# You can then use this to reference files relative to this directory.
abs_file_path = os.path.dirname(os.path.abspath(__file__))

# File to write the user-defined function prototypes extracted from gdb
USER_FN_DECLARATIONS_FILE_PATH = f"{abs_file_path}/user_fn_declarations.c"

# File to write the preprocessed C code to, before parsing with pycparser
FN_DECLARATIONS_PREPROCESSED = f"{abs_file_path}/user_fn_declarations_preprocessed"

USER_TYPE_DECLARATION_FILE_PATH = f"{abs_file_path}/user_type_declarations.c"

TYPE_DECLARATION_PREPROCESSED = f"{abs_file_path}/user_type_declarations_preprocessed"

"""
The parsing functions below will return a map of user-defined
functions. Key is function name, value is information about the
function, including file, line, num, param types, and return type.

Example:
functions = {
    'append': [
        {
            "file": "linkedlist/linkedlist.c",
            "line": 21,
            "param_types": [
                "List *",
                "int"
            ],
            "return_type": "void"
        },
        ...
    ],
    ...
}
"""


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


class ParseTypeDeclVisitor(DeclVisitor):

    def constructInfo(self, node):
        '''
        Expect isinstance(node, c_ast.Decl) or isinstance(node.type, c_ast.TypeDef)
        '''
        result = {}
        result["typeName"] = self.name
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line

        parseResult = self.visit(node.type)
        result['type'] = {'typeName': parseResult}

        return result


class ParseStructDefVisitor(DeclVisitor):

    def constructInfo(self, node):
        '''
        Expect isinstance(node, c_ast.Struct)
        '''
        result = {}
        result["typeName"] = f"struct {self.name}"
        result["file"] = self.file
        result["line_num"] = self.line_num
        result["original_line"] = self.original_line
        result['fields'] = []

        for decl in node.decls:
            parseResult = self.visit(decl)
            result['fields'].append(parseResult)

        return result


@useSocketIOConnection
def pycparser_parse_fn_decls(user_socket_id: str = None, sio=None):
    '''
    Using pycparser to parse type declarations by constructing AST. Including structs and typedefs.

    NOTE: Must run this function BEFORE starting the program in gdb, otherwise you get strange output from the 'info functions -n' command.

    Constructs a file that looks like this, to parse with the pycparser library:
    ```
    typedef struct node *List;

    struct node {
        int data;
        struct node *next;
    }

    List * appendNode(struct node *head, int data);
    ```
    '''

    # typedef and struct declarations need to be declared in the files of the
    # user-defined functions for pycparser to parse them correctly.
    type_decl_strs = get_type_decl_strs()

    fns_str: str = gdb.execute("info functions -n", False, True)

    # Parse the functions string
    fns_str_lines = re.split("\n", fns_str.strip())
    print("\n=== Raw lines as strings to potentially parse into function declarations:")
    pprint(fns_str_lines)

    functions: dict[str, list[dict]] = {}

    current_file = None
    for line in fns_str_lines:

        print("\n=== Current funs_str_lines line:")
        print(line)

        if m := re.fullmatch(r'^File.*:$', line):
            print("^^^ Matched file name")
            # Set new file name and reset text
            current_file = line.split(" ")[1][:-1]
        elif m := re.fullmatch(r'^(\d+):\t(.*;)$', line):
            print("^^^ Matched function declaration")
            line_num = int(m.group(1))
            fn_decl_str = m.group(2)

            ast = get_fn_decl_ast(
                type_decl_strs, fn_decl_str)

            # Traverse each node in top level of AST and extract function declarations. Necessary becauser there might be types (structs) and typedefs defined above the function declaration.
            for node in ast.ext:
                if not (isinstance(node, c_ast.Decl) and isinstance(node.type, c_ast.FuncDecl)):
                    continue

                func_name = node.name
                print(f'Parsing function declaration {func_name}')
                # node.show()
                # print(node)
                # print(node.type)

                funcDeclVisitor = ParseFuncDeclVisitor(
                    func_name, current_file, line_num, fn_decl_str)
                result = funcDeclVisitor.constructInfo(node)
                pprint(result)

                if user_socket_id is not None:
                    print("Sending parsed function declaration to server...")
                    sio.emit("createdFunctionDeclaration",
                             (user_socket_id, result))
                    enable_socketio_client_emit()

                functions[func_name] = result

    print(f"\n=== Finished running pycparser_parse_fn_decls in gdb instance\n\n")

    return functions


@useSocketIOConnection
def pycparser_parse_type_decls(user_socket_id: str = None, sio=None):
    '''
    Using pycparser to parse type declarations by constructing AST.

    NOTE: Must run this function BEFORE starting the program in gdb, otherwise you get strange output from the 'info types' command.
    '''

    print("\n=== Running pycparser_parse_type_decls in gdb instance\n\n")

    # typedef and struct declarations need to be declared in the files of the
    # user-defined types for pycparser to parse them correctly.
    type_decl_strs = get_type_decl_strs()
    '''
    For example, to parse the user-defined type `struct list`, we need to include
    the type declaration `struct node` in the preprocessed file before we can parse.
    '''

    types_str = gdb.execute("info types", False, True)
    types_str_lines = re.split("\n", types_str.strip())
    types = []
    print(types_str_lines)

    current_file = None
    for line in types_str_lines:
        print("\n=== Current types_str_lines line:")
        print(line)

        if m := re.fullmatch(r'^File (.*):$', line):
            print("^^^ Matched file name")
            # Set new file name and reset text
            current_file = m.group(1)
        elif m := re.fullmatch(r'^(\d+):\t(.*;)$', line):
            line_num = int(m.group(1))
            type_decl_str = m.group(2)

            ast = get_type_decl_ast(
                type_decl_strs,
                type_decl_str)
            pprint(ast)

            if len(ast.ext) > 0:
                # We are concerned with the last type/typedef that we put in
                # the preprocessed file, which is the one we want to parse.
                node = ast.ext[-1]
                if isinstance(node, c_ast.Decl) or isinstance(node, c_ast.Typedef):

                    if isinstance(node.type, c_ast.Struct):
                        node = node.type
                        type_name = node.name
                        print(f'Parsing struct definition {type_name}')

                        structDefVisitor = ParseStructDefVisitor(
                            type_name, current_file, line_num, type_decl_str)
                        result = structDefVisitor.constructInfo(node)
                        pprint(result)

                        types.append(result)

                    else:
                        type_name = node.name
                        print(f'Parsing type declaration {type_name}')

                        typeDeclVisitor = ParseTypeDeclVisitor(
                            type_name, current_file, line_num, type_decl_str)
                        result = typeDeclVisitor.constructInfo(node)
                        pprint(result)

                        types.append(result)

            if user_socket_id is not None:
                print(f"types parser: user sid is {user_socket_id}")
                print("Sending parsed type declaration -> server -> FE client...")
                sio.emit("createdTypeDeclaration",
                         (user_socket_id, result))
                enable_socketio_client_emit()

    print(f"\n=== Finished running pycparser_parse_type_decls in gdb instance\n\n")

    return types


def get_fn_decl_ast(type_decl_strs, fn_decl_str):
    '''
    1. Write a single user-defined function declaration to the file USER_FN_DECLARATIONS_FILE_PATH
    2. preprocess the C code to remove comments (redundant)
    3. Generate AST of the function declaration
    '''
    with open(USER_FN_DECLARATIONS_FILE_PATH, "w") as f:
        f.write("\n".join(type_decl_strs))
        f.write("\n")
        f.write(fn_decl_str)
        f.write("\n")

    """
    The resulting USER_FN_DECLARATIONS_FILE_PATH file looks something like this:
    ```
    typedef struct list List;
    struct list;
    struct node;

    void append(List * a, int a);
    ```
    """

    subprocess.run(f"gcc -E {USER_FN_DECLARATIONS_FILE_PATH} > {FN_DECLARATIONS_PREPROCESSED}",
                   shell=True)

    # Parse the preprocessed C code into an AST
    # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
    ast = parse_file(FN_DECLARATIONS_PREPROCESSED, use_cpp=True,
                     cpp_args=r'-Iutils/fake_libc_include')

    return ast


def get_type_decl_ast(type_decl_strs, type_decl_str_to_parse):
    '''
    Similar to get_fn_decl_ast() but for types (structs, typedefs)
    '''

    '''
    Replace struct decl e.g. "struct node;" with the struct definition
    e.g. "struct node { int value; struct node *next; };"
    See the following sample gdb output:
    ```
    (gdb) ptype struct node
    type = struct node {
        int data;
        struct node *next;
    }
    ```
    '''

    # If type (rather than typedef) is declared, expand into struct definition
    struct_decl_pattern = r'(struct\s+[a-zA-Z_]\w*);'
    if m := re.fullmatch(struct_decl_pattern, type_decl_str_to_parse):
        struct_decl = m.group(1)
        print(f"{struct_decl=}")
        struct_def_str = gdb.execute(f"ptype {struct_decl}", False, True)
        struct_def_str = re.sub(r'type = ', "", struct_def_str)
        print(f"{struct_def_str=}")
        type_decl_str_to_parse = struct_def_str.strip() + ";"

    # Remove the typedecl that we are parsing from the list of type
    # declarations to write to the file before the typedecl that we are parsing.
    type_decl_strs = filter(
        lambda s: s != type_decl_str_to_parse, type_decl_strs)
    with open(USER_TYPE_DECLARATION_FILE_PATH, "w") as f:
        # Write all user-defined type and typedef declarations that might be
        # necessary to parse the struct definition
        f.write("\n".join(type_decl_strs))
        f.write("\n")
        f.write(type_decl_str_to_parse)
        f.write("\n")

    subprocess.run(f"gcc -E {USER_TYPE_DECLARATION_FILE_PATH} > {TYPE_DECLARATION_PREPROCESSED}",
                   shell=True)

    # Parse the preprocessed C code into an AST
    # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
    ast = parse_file(TYPE_DECLARATION_PREPROCESSED, use_cpp=True,
                     cpp_args=r'-Iutils/fake_libc_include')

    return ast


def get_type_decl_strs():
    '''
    Output from gdb command `info types` looks something like this:
    ```
    (gdb) info types
    All defined types:

    File /usr/lib/gcc/aarch64-linux-gnu/11/include/stddef.h:
    209:	typedef unsigned long size_t;

    File linkedlist/linkedlist.c:
        char
        int
        long
        long long
        unsigned long long
        unsigned long
        short
        unsigned short
        signed char
        unsigned char
        unsigned int

    File linkedlist/linkedlist.h:
    17:	typedef struct list List;
    14:	struct list;
    9:	struct node;

    File linkedlist/main3.c:
        char
        int
        long
        long long
        unsigned long long
        unsigned long
        short
        unsigned short
        signed char
        unsigned char
        unsigned int
    ```

    This function will extract the user-defined types and typedefs as well as other std types and typedefs, and return in following list format:

    [
        "typedef unsigned long size_t;",
        "typedef struct list List;",
        "struct list;",
        "struct node;",
    ]

    This information serves a variety of purposes:
    1. Allow user to annotate their types on the frontend to inform the visual debugger
        what types to treat as specific data structures e.g. linked list nodes.
    2. Allow the parser to parse function declarations that use the user-defined types.
        E.g. `List * insert(List *head, struct node *new_node);`
    3. Allow the malloc interceptor to know what user-defined types exist when parsing lines
        like `List *head = malloc(sizeof(List));`

    '''
    types_str = gdb.execute("info types", False, True)
    types_str_lines = re.split("\n", types_str.strip())
    types = []
    for line in types_str_lines:
        if m := re.fullmatch(r'^(\d+):\t(.*;)$', line):
            # Valid type
            types.append(m.group(2))

    print("\nUser-defined type declaration strings:")
    pprint(types)
    return types


def manual_regex_parse_fn_decl():
    '''
    DEPRECATED
    Writing a regex to parser function declarations.
    A bit hopeless. Should use a prewritten parser like pycparser.
    See below function.
    '''
    # Regex to match function signature
    fn_signature_pattern = r'((?:[a-zA-Z_]\w*(?:\s*\*+\s*)*)+)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)'

    # Regex to match function parameters
    fn_params_pattern = r'((?:[a-zA-Z_]\w*(?:\s*\*+\s*)*)+)\s+([a-zA-Z_]\w*)'

    functions: dict[str, list[dict]] = {}

    functions_str = gdb.execute("info functions -n", False, True)
    print("\n===Functions string:")
    print(functions_str)

    # Parse the functions string
    functions_str_lines = re.split("\n", functions_str.strip())

    current_file = ""
    for line in functions_str_lines:

        if m := re.fullmatch(r'^All defined functions$'):
            pass
        elif m := re.fullmatch(r'^File.*:$', line):
            # Get the file name
            current_file = line.split(" ")[1][:-1]
            if current_file not in functions:
                functions[current_file] = []
        elif m := re.fullmatch(r'^(\d+): (.*);$', line):
            fn_signature = m.group(2)
            # Example: "void append(List *, int)"
            print(f"=== Matched function signature: {fn_signature.group(0)}")

            # TODO: check this from gpt
            matches = re.findall(fn_signature_pattern, fn_signature)

            for match in matches:
                return_type = match[0]
                function_name = match[1]
                parameters_text = match[2]

                print("Return Type:", return_type)
                print("Function Name:", function_name)

                # Extract and print individual parameters
                parameters = re.findall(fn_params_pattern, parameters_text)
                print("Parameters:")
                for param in parameters:
                    param_type = param[0]
                    param_name = param[1]
                    print(f"  Type: {param_type}, Name: {param_name}")

            new_fn = {
                "file": current_file,
                "line": int(m.group(1)),
                "param_types": [],
                "return_type": "TODO"
            }
            functions.append(new_fn)

    pprint(functions)
    return functions


if __name__ == '__main__':
    # For testing purposes
    # _ = pycparser_parse_fn_decls()
    # _ = pycparser_parse_type_decls()
    pass
