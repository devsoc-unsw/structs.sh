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
        gdb.execute('step')


# Run in gdb with `python NodeListCommand("nodelist", "list2")`
# NodeListCommand("nodelist", "list2")

# Useful

# info functions -n

def nextUntilEnd():
    while any(t.is_running() for t in gdb.selected_inferior().threads()):
        gdb.execute('next')

        # Add new heap memory to heap_dict
        # If malloc

        # Update existing tracked heap memory
        for addr in self.heap_dict.keys():
            update(heap_dict, addr)

        # Remove freed heap memory from heap_dict
