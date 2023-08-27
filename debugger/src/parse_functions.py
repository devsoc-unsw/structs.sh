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

See "debugger/samples/fn_prototypes.c" for test function prototypes,
or "debugger/samples/fn_prototypes_nocomment.c" 

Not: pycparser does not support C comments and will fail if there are
comments in the C code. Pass the C code through a preprocessor to
remove comments before parsing with pycparser.
"""
from pprint import pprint
import re
import subprocess
import sys
import gdb
from pycparser import parse_file, c_ast
import socketio

# Relative path to the test C file with function prototypes
FN_PROTOTYPES_TEST_FILE = "samples/fn_prototypes.c"

# File to write the user-defined function prototypes extracted from gdb
USER_FN_PROTOTYPES_FILE_PATH = "user_fn_prototypes.c"

# File to write the preprocessed C code to, before parsing with pycparser
FN_PROTOTYPES_PREPROCESSED = "fn_prototypes_preprocessed"

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

# sys.path.extend(['.', '..'])


"""
Output of the gdb command `info types` looks something like this:

```
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

File linkedlist/main1.c:
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

We need to extract the user-defined types and typedefs as well as other std types and typedefs.
They serve two purposes:
1. Allow user to annotate their types on the frontend to inform the visual debugger
    what types to treat as specific data structures e.g. linked list nodes.
2. Allow the parser to parse function declarations that use the user-defined types.
    E.g. `List * insert(List *head, struct node *new_node);`

"""


def pycparser_parse_type_decls():
    '''
    Using pycparser to parse type declarations by constructing AST.
    TODO
    '''
    types = []
    return types


def pycparser_parse_fn_decls(socket_id: str = None):
    '''
    Using pycparser to parse function declarations by constructing AST.
    TODO: Use visitor pattern to traverse AST and extract function declaration info.
    '''

    # typedef and struct declarations need to be declared in the files of the
    # user-defined functions for pycparser to parse them correctly.
    type_decl_strs = get_type_decl_strs()

    fns_str: str = gdb.execute("info functions -n", False, True)

    # Parse the functions string
    fns_str_lines = re.split("\n", fns_str.strip())
    print(fns_str_lines)

    functions: dict[str, list[dict]] = {}

    current_file = None
    for line in fns_str_lines:

        print(line)

        if m := re.fullmatch(r'^File.*:$', line):
            print("^^^ Matched file name")
            # Set new file name and reset text
            current_file = line.split(" ")[1][:-1]
        elif m := re.fullmatch(r'^(\d+):\t(.*;)$', line):
            print("^^^ Matched function declaration")
            line_num = int(m.group(1))
            fn_decl_str = m.group(2)

            fn_decl_str = re.sub(r',', r' a,', fn_decl_str)
            fn_decl_str = re.sub(r'\)', r' a)', fn_decl_str)

            print(f"transformed fn decl: {fn_decl_str}")

            # Write a single user-defined function declaration to the file USER_FN_PROTOTYPES_FILE_PATH
            # then preprocess the C code to remove comments (redundant)
            subprocess.run("echo -e " + "\n".join(type_decl_strs) + "\n" + fn_decl_str + "\n" + f"> {USER_FN_PROTOTYPES_FILE_PATH} ; gcc -E {USER_FN_PROTOTYPES_FILE_PATH} > {FN_PROTOTYPES_PREPROCESSED}; cat {FN_PROTOTYPES_PREPROCESSED}",
                           shell=True)

            """
            The resulting USER_FN_PROTOTYPES_FILE_PATH file looks something like this:
            ```
            typedef struct list List;
            struct list;

            void append(List * a, int a);
            ```
            """

            # Parse the preprocessed C code into an AST
            # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
            ast = parse_file(FN_PROTOTYPES_PREPROCESSED, use_cpp=True,
                             cpp_args=r'-Iutils/fake_libc_include')

            # Traverse each node in top level of AST and extract function declarations
            for node in ast.ext:
                if not (isinstance(node, c_ast.Decl) and isinstance(node.type, c_ast.FuncDecl)):
                    continue

                print(f'\n=== Parsing function declaration {node.name}')
                function = {}
                function['file'] = current_file
                function['line_num'] = line_num
                func_name = node.name
                function["name"] = func_name
                # print(f"Function Name: {func_name}")

                return_type_ast = node.type.type
                return_type = None
                if isinstance(return_type_ast, c_ast.PtrDecl):
                    if isinstance(return_type_ast.type, c_ast.Struct):
                        return_type = "struct " + \
                            return_type_ast.type.type.name + " *"
                    elif isinstance(return_type_ast.type, c_ast.TypeDecl):
                        if isinstance(return_type_ast.type.type, c_ast.Struct):
                            return_type = "struct " + \
                                return_type_ast.type.type.name + " *"
                        else:
                            return_type = " ".join(
                                return_type_ast.type.type.names) + " *"
                    else:
                        return_type = " ".join(
                            return_type_ast.type.type.names) + " *"
                elif isinstance(return_type_ast, c_ast.TypeDecl):
                    if isinstance(return_type_ast.type, c_ast.Struct):
                        return_type = "struct " + \
                            return_type_ast.type.name
                    else:
                        return_type = " ".join(return_type_ast.type.names)
                else:
                    raise Exception("Unknown return type")
                function["return_type"] = return_type

                function['params'] = []
                for param_ast in node.type.args.params if node.type.args else []:
                    param_name = param_ast.name
                    param_type = None
                    if isinstance(param_ast.type, c_ast.PtrDecl):
                        if isinstance(param_ast.type.type.type, c_ast.Struct):
                            param_type = "struct "+param_ast.type.type.type.name + " *"
                        else:
                            param_type = " ".join(
                                param_ast.type.type.type.names) + " *"
                    elif isinstance(param_ast.type, c_ast.TypeDecl):
                        if isinstance(param_ast.type.type, c_ast.Struct):
                            param_type = "struct "+param_ast.type.type.name
                        else:
                            param_type = " ".join(param_ast.type.type.names)
                    elif isinstance(param_ast.type, c_ast.ArrayDecl):
                        param_type = " ".join(
                            param_ast.type.type.type.names) + f"[{param_ast.type.dim.value if param_ast.type.dim else ''}]"
                    else:
                        raise Exception("Unknown param type")
                    function['params'].append({
                        'type': param_type,
                        'name': param_name
                    })

                pprint(function)
                if socket_id is not None:
                    io = socketio.Server(cors_allowed_origins='*')
                    io.emit("mainDebug", f"{function}", room=socket_id)

                functions[func_name] = function

    return functions


def get_type_decl_strs():
    types_str = gdb.execute("info types", False, True)
    types_str_lines = re.split("\n", types_str.strip())
    types = []
    for line in types_str_lines:
        if m := re.fullmatch(r'^(\d+):\t(.*;)$', line):
            # Valid type
            types.append(m.group(2))

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
    _ = pycparser_parse_fn_decls()
    _ = pycparser_parse_type_decls()
