"""
Getting this error in gdb:
```
Python Exception <class 'gdb.error'>: No symbol "variable_name" in current context.
Error occurred in Python: No symbol "variable_name" in current context.
```
"""

import gdb
import json

# Define a custom command to extract the linked list nodes


class NodeListCommand(gdb.Command):
    def __init__(self, cmd_name, variable_name):
        super(NodeListCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.variable_name = variable_name

    def invoke(self, arg, from_tty):
        linked_list = gdb.parse_and_eval(self.variable_name)
        nodes = []

        # Traverse the linked list and collect node information
        n = linked_list["head"]
        while n:
            data = int(n["data"])
            address = str(n)
            next_address = str(n["next"]) if n["next"] else None

            node = {"Data": data, "Address": address, "Next": next_address}
            nodes.append(node)

            n = n["next"]

        # Store the nodes as an array of dictionaries
        nodes_dict = {"Nodes": nodes}


# Run in gdb with `python NodeListCommand("nodelist", "list2")`
# NodeListCommand("nodelist", "list2")
