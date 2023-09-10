import os
import gdb
import subprocess
from pycparser import parse_file, c_ast
import re

# Parent directory of this python script e.g. "/user/.../debugger/src/gdb_scripts"
# In the docker container this will be "/app/src/gdb_scripts"
# You can then use this to reference files relative to this directory.
abs_file_path = os.path.dirname(os.path.abspath(__file__))

# File to write the user-written malloc calls extracted from gdb
USER_MALLOC_CALL_FILE_PATH = f"{abs_file_path}/user_malloc_call.c"

# File to write the preprocessed C code to, before parsing with pycparser
USER_MALLOC_CALL_PREPROCESSED = f"{abs_file_path}/user_malloc_call_preprocessed"


def remove_non_standard_characters(input_str):
    # Remove color codes and non-standard characters using a regular expression
    clean_str = re.sub(r'\x1b\[[0-9;]*[mK]', '', input_str)
    return clean_str


class MallocVisitor(c_ast.NodeVisitor):
    def __init__(self):
        self.malloc_variables = []
        self.free_variables = []
        self.free = "False"

    def visit_Assignment(self, node):
        # Check if the assignment is of the form "variable = malloc(...)"
        if isinstance(node.rvalue, c_ast.FuncCall) and isinstance(node.rvalue.name, c_ast.ID) and node.rvalue.name.name == 'malloc':
            if isinstance(node.lvalue, c_ast.StructRef):
                var_name = self.get_variable_name(node.lvalue)
                self.malloc_variables.append(var_name)
            elif isinstance(node.lvalue, c_ast.ID):
                self.malloc_variables.append(node.lvalue.name)
        self.generic_visit(node)

    def visit_FuncCall(self, node):
        # Check if the function call is to "free(variable)"
        if isinstance(node.name, c_ast.ID) and node.name.name == 'free':
            self.free = "True"
            if len(node.args.exprs) == 1 and isinstance(node.args.exprs[0], c_ast.ID):
                self.free_variables.append(node.args.exprs[0].name)
        self.generic_visit(node)

    def visit_Decl(self, node):
        # Check if the declaration initializes with malloc, e.g., "Type *var = malloc(...)"
        if node.init and isinstance(node.init, c_ast.FuncCall) and isinstance(node.init.name, c_ast.ID) and node.init.name.name == 'malloc':
            if isinstance(node.type, c_ast.PtrDecl):
                var_name = node.name
                self.malloc_variables.append(var_name)
        self.generic_visit(node)

    def get_variable_name(self, node):
        # Recursively get the variable name from the pointer chain
        if isinstance(node, c_ast.StructRef):
            base = self.get_variable_name(node.name)
            field = node.field.name
            return f"{base}->{field}"
        elif isinstance(node, c_ast.ID):
            return node.name
        return None


# Define a custom command to extract the linked list nodes
class NextCommand(gdb.Command):
    def __init__(self):
        super(NextCommand, self).__init__("myNext", gdb.COMMAND_USER)
        self.heap_dict = {}

    def invoke(self, arg, from_tty):

        temp_line = gdb.execute('frame', to_string=True)
        raw_str = (temp_line.split('\n')[1]).split('\t')[1]
        line_str = remove_non_standard_characters(raw_str)

        # Create a complete C code file with function prototypes, main, and variable line
        complete_c_code = f"""
struct node {{
  int data;
  struct node *next;
}};

typedef struct list {{
  struct node *head;
  int size;
}} List;

int main(int argc, char **argv) {{
{line_str}
}}
"""

        # Write the complete C code to a file
        with open(USER_MALLOC_CALL_FILE_PATH, "w") as f:
            f.write(complete_c_code)

        subprocess.run(f"gcc -E {USER_MALLOC_CALL_FILE_PATH} > {USER_MALLOC_CALL_PREPROCESSED}",
                       shell=True)

        # Parse the preprocessed C code into an AST
        # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
        ast = parse_file(USER_MALLOC_CALL_PREPROCESSED, use_cpp=True,
                         cpp_args=r'-Iutils/fake_libc_include')

        # Create a MallocVisitor instance
        malloc_visitor = MallocVisitor()

        # Set the current node to the root of the AST
        malloc_visitor.current_node = ast

        # Visit the AST to check for malloc calls
        malloc_visitor.visit(ast)

        # Print the variable names assigned to malloc
        print("Variables assigned to malloc:")
        for var in malloc_visitor.malloc_variables:
            print(var)

        # Print the variable names being freed
        print(malloc_visitor.free)
        print("Variables being freed:")
        for var in malloc_visitor.free_variables:
            print(var)

        # TODO: Need a way to detect if program exits, then send signal to server
        # which should tell the client that the debugging session is over.
        gdb.execute('next')

        return self.heap_dict

    def get_heap_dict(self):
        return self.heap_dict


nextCommand = NextCommand()
