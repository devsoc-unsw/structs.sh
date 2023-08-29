'''
Getting this error in gdb:
```
Python Exception <class 'gdb.error'>: No symbol "variable_name" in current context.
Error occurred in Python: No symbol "variable_name" in current context.
```
'''

import gdb
import json

# Define a custom command to extract the linked list nodes


class StepCommand(gdb.Command):
    def __init__(self, cmd_name, user_functions):
        super(StepCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.user_functions = user_functions
        self.heap_dict = {}

    def invoke(self, arg, from_tty):

        curr_line = gdb.execute('frame', to_string=True)
        # TODO parse line, find call to malloc,
        # step into malloc for args (num bytes malloced) and return address on `finish`

        # === Add new heap memory to heap_dict
        # Intercept malloc
        # if line has call to malloc
        #   # if the type of data malloced is the user's annotate linked list type
        #   # get the address to the malloc'ed memory
        #   # store address and memory in heap dictionary

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
