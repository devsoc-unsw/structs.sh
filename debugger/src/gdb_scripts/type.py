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
    clean_str = re.sub(r"\x1b\[[0-9;]*[mK]", "", input_str)
    return clean_str


class NextCommand(gdb.Command):
    def __init__(self):
        super(NextCommand, self).__init__("myNext", gdb.COMMAND_USER)
        self.heap_dict = {}

    def invoke(self, arg, from_tty):
        temp_line = gdb.execute("frame", to_string=True)
        raw_str = (temp_line.split("\n")[1]).split("\t")[1]
        line_str = remove_non_standard_characters(raw_str)

        # Create a complete C code file with function prototypes, main, and variable line
        complete_c_code = """
struct node {
    int data;
    struct node *next;
};
"""

        complete_c_code_2 = """
struct list {
    struct node *head;
    int size;
};
"""

        complete_c_code_3 = f"""
typedef struct list {{
  struct node *head;
  int size;
}} List;
"""

        # Write the complete C code to a file
        with open(USER_MALLOC_CALL_FILE_PATH, "w") as f:
            f.write(complete_c_code)

        subprocess.run(
            f"gcc -E {USER_MALLOC_CALL_FILE_PATH} > {USER_MALLOC_CALL_PREPROCESSED}",
            shell=True,
        )

        # TODO: Need a way to detect if the program exits, then send a signal to the server
        # which should tell the client that the debugging session is over.
        gdb.execute("next")

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
