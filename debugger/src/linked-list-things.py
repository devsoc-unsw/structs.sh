'''
Getting this error in gdb:
```
Python Exception <class 'gdb.error'>: No symbol "variable_name" in current context.
Error occurred in Python: No symbol "variable_name" in current context.
```
'''

import gdb
import json
import subprocess
from pycparser import parse_file, c_ast

# C file storing malloc line
MALLOC_TEST_FILE = "samples/malloc.c"

# File to write the preprocessed C code to, before parsing with pycparser
MALLOC_PREPROCESSED = "malloc_preprocessed"



# Define a custom command to extract the linked list nodes
class NextCommand(gdb.Command):
    def __init__(self, cmd_name, user_functions):
        super(NextCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.user_functions = user_functions
        self.heap_dict = {}

    def invoke(self, arg, from_tty):

        temp_line = gdb.execute('frame', to_string=True)
        line_str = (temp_line.split('\n')[1]).split('\t')[1]
        

        # TODO parse line, find call to malloc,
        # step into malloc for args (num bytes malloced) and return address on `finish`

        # === Add new heap memory to heap_dict
        # Intercept malloc
        # if line has call to malloc
        #   # if the type of data malloced is the user's annotate linked list type
        #   # get the address to the malloc'ed memory
        #   # store address and memory in heap dictionary

        with open(MALLOC_TEST_FILE, "w") as f:
            f.write(line_str)
        subprocess.run(f"gcc -E {MALLOC_TEST_FILE} > {MALLOC_PREPROCESSED}",
                        shell=True)
    
        # Parse the preprocessed C code into an AST
        # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
        ast = parse_file(MALLOC_PREPROCESSED, use_cpp=True,
                            cpp_args=r'-Iutils/fake_libc_include')
        print(ast)



        # === Up date existing tracked heap memory
        # for addr in self.heap_dict.keys():
        #  # update(heap_dict, addr)

        # === Remove freed heap memory from heap_dict
        # Intercept free
        # if line has call to free
        #   # what address is being freed
        #   # look for the address in heap dictionary

        if any(t.is_running() for t in gdb.selected_inferior().threads()):
            gdb.execute('next')

        return self.heap_dict


# Run in gdb with `python NodeListCommand("nodelist", "list2")`
# NodeListCommand("nodelist", "list2")

def myNext():
    print("next (stub, does nothing)")
