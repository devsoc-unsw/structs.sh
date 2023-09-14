'''
Getting this error in gdb:
```
Python Exception <class 'gdb.error'>: No symbol "variable_name" in current context.
Error occurred in Python: No symbol "variable_name" in current context.
```
'''

import gdb
import subprocess
from pycparser import parse_file, c_ast
import re

# C file storing malloc line
MALLOC_TEST_FILE = "user_malloc.c"

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

            # Check if the malloc call has arguments
            if node.args and isinstance(node.args, c_ast.ExprList) and len(node.args.exprs) == 1:
                malloc_size_node = node.args.exprs[0]

                # Extract the size of malloc
                if isinstance(malloc_size_node, c_ast.BinaryOp) and malloc_size_node.op == '*':
                    if isinstance(malloc_size_node.left, c_ast.Constant):
                        malloc_size = int(malloc_size_node.left.value)

                    # Extract the type being malloced (if available)
                    if isinstance(malloc_size_node.right, c_ast.UnaryOp) and malloc_size_node.right.op == 'sizeof':
                        if isinstance(malloc_size_node.right.expr, c_ast.Typename):
                            malloc_type = malloc_size_node.right.expr.type

            # Store the malloc information
            self.malloc_info.append({
                'variable_name': variable_name,
                'malloc_size': malloc_size,
                'malloc_type': malloc_type,
                'variable_name_2': self.variable_name_2,  # Include the new variable name
            })

# Define a custom command to extract the linked list nodes


class NextCommand(gdb.Command):
    '''
    To be run in gdb:

    (gdb) python NextCommand("my_next")
    (gdb) my_next

    '''

    def __init__(self, cmd_name, user_socket_id):
        super(NextCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.user_socket_id = user_socket_id
        self.heap_dict = {}

    def invoke(self, arg, from_tty):

        print("\n=== Running my_next command in gdb...")

        temp_line = gdb.execute('frame', to_string=True)
        raw_str = (temp_line.split('\n')[1]).split('\t')[1]
        line_str = remove_non_standard_characters(raw_str)

        # TODO parse line, find call to malloc,
        # step into malloc for args (num bytes malloced) and return address on `finish`

        # === Add new heap memory to heap_dict
        # Intercept malloc
        # if line has call to malloc
        #   # if the type of data malloced is the user's annotate linked list type
        #   # get the address to the malloc'ed memory
        #   # store address and memory in heap dictionary

        with open(MALLOC_TEST_FILE, "w+") as f:
            f.write(line_str)

        subprocess.run(f"gcc -E {MALLOC_TEST_FILE} > {MALLOC_PREPROCESSED}",
                       shell=True)

        # Parse the preprocessed C code into an AST
        # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
        ast = parse_file(MALLOC_PREPROCESSED, use_cpp=True,
                         cpp_args=r'-Iutils/fake_libc_include')
        print(ast)

        # Create a MallocVisitor instance
        malloc_visitor = MallocVisitor()

        # Set the current node to the root of the AST
        malloc_visitor.current_node = ast

        # Visit the AST to check for malloc calls
        malloc_visitor.visit(ast)

        # Print the malloc information
        for info in malloc_visitor.malloc_info:
            print("Malloc Information:")
            print(f"Variable assigned to malloc: {info['variable_name']}")
            print(f"Variable assigned to malloc V2: {info['variable_name_2']}")
            print(f"Size of malloc: {info['malloc_size']} bytes")
            print(f"Type malloced: {info['malloc_type']}")

        # === Up date existing tracked heap memory

        # for addr in self.heap_dict.keys():
        #  # update(heap_dict, addr)

        # === Remove freed heap memory from heap_dict
        # Intercept free
        # if line has call to free
        #   # what address is being freed
        #   # look for the address in heap dictionary

        # Extract stack frame information (state of local variables)
        # and send to frontend client
        # self.extract_stack_data()

        send_heap_dict_to_server(self.user_socket_id, self.heap_dict)

        if any(t.is_running() for t in gdb.selected_inferior().threads()):
            gdb.execute('next')

        return self.heap_dict

    def extract_stack_data(self):

        #  TODO: validate this copilot autogen
        # Extract stack frame information (state of local variables)
        # and send to frontend client
        frame = gdb.selected_frame()
        block = frame.block()
        for symbol in block:
            if symbol.is_argument or symbol.is_variable:
                print(symbol.name)
                print(symbol.value(frame))


@useSocketIOConnection
def send_heap_dict_to_server(user_socket_id: str, heap_dict: dict, sio=None):
    sio.emit("sendBackendStateToUser",
             user_socket_id, heap_dict)
