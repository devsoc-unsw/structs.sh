import gdb
import subprocess
from pycparser import parse_file, c_ast
import re

# C file storing malloc line
MALLOC_TEST_FILE = "samples/malloc.c"

# File to write the preprocessed C code to, before parsing with pycparser
MALLOC_PREPROCESSED = "malloc_preprocessed"


def remove_non_standard_characters(input_str):
    # Remove color codes and non-standard characters using a regular expression
    clean_str = re.sub(r'\x1b\[[0-9;]*[mK]', '', input_str)
    return clean_str


# Define a custom visitor class to traverse the AST and extract malloc information
class MallocVisitor(c_ast.NodeVisitor):
    def __init__(self):
        self.malloc_info = []
        self.variable_name_2 = None  # Initialize the new variable

    def visit_TypeDecl(self, node):
        if isinstance(node, c_ast.TypeDecl) and node.declname:
            self.variable_name_2 = node.declname

    def visit_FuncCall(self, node):
        if isinstance(node.name, c_ast.ID) and node.name.name == "malloc":
            # Extract information about the malloc call
            malloc_size = None
            variable_name = None
            malloc_type = None

            # Find the assignment statement enclosing the malloc call
            current_node = self.current_node
            while current_node is not None:
                if isinstance(current_node, c_ast.Assignment):
                    if isinstance(current_node.rvalue, c_ast.FuncCall) and current_node.rvalue.name.name == "malloc":
                        # Extract the variable name from the assignment statement
                        if isinstance(current_node.lvalue, c_ast.ID):
                            variable_name = current_node.lvalue.name

                        break

                current_node = getattr(current_node, 'parent', None)

            # Store the malloc information
            self.malloc_info.append({
                'variable_name': variable_name,
                'variable_name_2': self.variable_name_2,  # Include the new variable name
            })

# Define a custom command to extract the linked list nodes
class NextCommand(gdb.Command):
    def __init__(self, cmd_name, user_functions):
        super(NextCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.user_functions = user_functions
        self.heap_dict = {}

    def invoke(self, arg, from_tty):

        temp_line = gdb.execute('frame', to_string=True)
        raw_str = (temp_line.split('\n')[1]).split('\t')[1]
        line_str = remove_non_standard_characters(raw_str)

        with open(MALLOC_TEST_FILE, "w") as f:
            f.write(line_str)
        subprocess.run(f"gcc -E {MALLOC_TEST_FILE} > {MALLOC_PREPROCESSED}",
                       shell=True)

        #try:
        # Parse the preprocessed C code into an AST
        # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
        ast = parse_file(MALLOC_PREPROCESSED, use_cpp=True,
                            cpp_args=r'-Iutils/fake_libc_include')

        # Create a MallocVisitor instance
        malloc_visitor = MallocVisitor()

        # Set the current node to the root of the AST
        malloc_visitor.current_node = ast

        # Visit the AST to check for malloc calls
        malloc_visitor.visit(ast)

        for info in malloc_visitor.malloc_info:
            print("Malloc Information:")
            try:
                if info['variable_name'] is None:
                    print(f"Variable assigned to malloc V2: {info['variable_name_2']}")
                else:
                    print(f"Variable assigned to malloc: {info['variable_name']}")
            except gdb.error as e:
                print(f"Error occurred: {e}")

        #except Exception as e:
        #    print(f"Cannot be parsed, Error: {e}")

        if any(t.is_running() for t in gdb.selected_inferior().threads()):
            gdb.execute('next')

        return self.heap_dict


def myNext():
    print("next (stub, does nothing)")
