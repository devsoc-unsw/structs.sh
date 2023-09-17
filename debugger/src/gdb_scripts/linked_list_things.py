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

# File to write ptype output
USER_PTYPE = f"{abs_file_path}/ptype_output.c"

# File to write preprocessed ptype output, befor parsing with pycparser
USER_PTYPE_PREPROCESSED = f"{abs_file_path}/ptype_preprocessed"


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
        complete_c_code = """
struct node {
    int data;
    struct node *next;
};

typedef struct list {
    struct node *head;
    int size;
} List;
int main(int argc, char **argv) {
"""
        complete_c_code = complete_c_code + line_str + "\n}"
        #print(complete_c_code)

        complete_c_code_2 = f"""
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
        try:
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
            if len(malloc_visitor.malloc_variables) > 0:
                print("Variables assigned to malloc:")
                for var in malloc_visitor.malloc_variables:
                    print(var)

                    var_type = gdb.execute(f"ptype {var}", to_string=True)
                    var_type = var_type.split('= ')[1]
                    var_type = var_type.replace('} *', '};')
                    print(f"{var_type}")

                    # Write the ptype to a file
                    with open(USER_PTYPE, "w") as f:
                        f.write(var_type)

                    subprocess.run(f"gcc -E {USER_PTYPE} > {USER_PTYPE_PREPROCESSED}",
                                shell=True)

                    # Parse the preprocessed C code into an AST
                    # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
                    ast = parse_file(USER_PTYPE_PREPROCESSED, use_cpp=True,
                                    cpp_args=r'-Iutils/fake_libc_include')
                    #print(ast)

                    # Print the outermost struct name found in the AST
                    struct_name = self.find_outermost_struct_name(ast)
                    if struct_name:
                        struct_name = 'struct ' + struct_name
                        print(f"Struct name: {struct_name}")
                    else:
                        print("No struct names found in the AST.")

                    # Break on malloc
                    gdb.execute('break')

                    # Step into malloc
                    gdb.execute('step')

                    # Use p bytes to get the bytes allocated
                    temp_bytes = gdb.execute('p bytes', to_string=True)
                    bytes = temp_bytes.split(" ")[2]
                    # Remove \n from bytes
                    bytes = re.sub(r'\n', '', bytes)
                    print(f"Bytes allocated: {bytes}")

                    # Get the address returned by malloc
                    gdb.execute('finish')
                    temp_address = gdb.execute('print $', to_string=True)
                    address = re.sub(r'\n', '', temp_address.split(' ')[-1])
                    print(f"address EXTRACTED: {address}")

                    obj = {
                        "variable": var,
                        "type": struct_name,
                        "size": bytes
                    }
                    self.heap_dict[address] = obj
                    print(self.heap_dict)


            else:
                print("No variable being malloced")


            # Print the variable names being freed
            print(malloc_visitor.free)
            print("Variables being freed:")
            for var in malloc_visitor.free_variables:
                print(var)

            # TODO: Need a way to detect if program exits, then send signal to server
            # which should tell the client that the debugging session is over.
            gdb.execute('next')
        except Exception as e:
            #print(f"An error occurred: {e}")
            # Go to next line if curr line cannot be parsed
            gdb.execute('next')

            return self.heap_dict


    def get_heap_dict(self):
        return self.heap_dict

    def find_outermost_struct_name(self, node):
        if isinstance(node, c_ast.Struct):
            return node.name
        for _, child in node.children():
            result = self.find_outermost_struct_name(child)
            if result:
                return result
        return None

nextCommand = NextCommand()
