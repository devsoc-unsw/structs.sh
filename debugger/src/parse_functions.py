"""
Get user-defined functions in the target c files that make up
the compiled binary being debugged.

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
import sys
from pycparser import parse_file, c_ast

FN_PROTOTYPES_TEST_FILE = "samples/fn_prototypes_nocomment.c"

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


def manual_regex_parse_fn_decl():
    '''
    Writing a regex to parser function declarations.
    A bit hopeless.
    '''
    # Regex to match function signature
    # Example: TODO
    fn_signature_pattern = r'((?:[a-zA-Z_]\w*(?:\s*\*+\s*)*)+)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)'

    # Regex to match function parameters
    # Example: TODO
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
                parameters = re.findall(param_pattern, parameters_text)
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


# sys.path.extend(['.', '..'])

def pycparser_parse_fn_decl():
    '''
    Using pycparser to parse function declarations by constructing AST.
    TODO: Use visitor pattern to traverse AST and extract function declaration info.
    '''

    functions = {}

    # Parse the C code into an AST
    ast = parse_file(FN_PROTOTYPES_TEST_FILE, use_cpp=True,
                     cpp_args=r'-Iutils/fake_libc_include')

    # print(ast.ext)
    # Now you can traverse and analyze the AST
    # For example, you can print the function signatures
    for node in ast.ext:
        # if isinstance(node, c_ast.FuncDecl):
        # if isinstance(node, Decl):
        # print(node)
        if isinstance(node, c_ast.Decl) and isinstance(node.type, c_ast.FuncDecl):
            print(f'\n=== Parsing function declaration {node.name}')
            function = {}
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

            functions[func_name] = function

    return functions


if __name__ == '__main__':
    pycparser_parse_fn_decl().values()
