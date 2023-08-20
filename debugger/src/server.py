import socketio
import eventlet
from typing import Any
import subprocess
import json

# Later we want to receive the variable name, line number and file_name from the client
variable_name = "list2"
line_number = "126"
file_name = "program"
    
# Construct the GDB script
gdb_script = f"""

def compile_program(file_name):
    subprocess.run(["gcc", "-ggdb", file_name, "-o", "program"])    



def create_ll_script(line_number, variable_name, file_name):
    gdb_script = f
python
import gdb
import json

# Define a custom command to extract the linked list nodes
class NodeListCommand(gdb.Command):
    def __init__(self):
        super(NodeListCommand, self).__init__("nodelist", gdb.COMMAND_USER)

    def invoke(self, arg, from_tty):
        linked_list = gdb.parse_and_eval("{variable_name}")
        nodes = []

        # Traverse the linked list and collect node information
        n = linked_list["head"]
        while n:
            data = int(n["data"])
            address = str(n)
            next_address = str(n["next"]) if n["next"] else None

            node = {{"Data": data, "Address": address, "Next": next_address}}
            nodes.append(node)

            n = n["next"]

        # Store the nodes as an array of dictionaries
        nodes_dict = {{"Nodes": nodes}}
        print(json.dumps(nodes_dict))

NodeListCommand()
end

file {file_name}
break {line_number}
run
nodelist
continue
quit
"""


io = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(io)


@io.event
def connect(socket_id: str, *_) -> None:
    print("Client connected: ", socket_id)


@io.event
def disconnect(socket_id: str) -> None:
    print("Client disconnected: ", socket_id)
    

@io.event
def getBreakpoints(socket_id: str, line: Any, listName: Any) -> None:
    print("Received message from", socket_id)
    print("Echoing message back to client...")

    
    # Compile C program
    compile_program("program.c")

    # Run GDB with the script
    script = create_ll_script(line, listName, "program")

    command = f'echo "{script}" | gdb -q'
    output = subprocess.check_output(command, shell=True).decode("utf-8")


    # Find the JSON data in the GDB output
    json_start = output.find("{")
    json_end = output.rfind("}") + 1
    json_data = output[json_start:json_end]

    # Parse the JSON data into a Python dictionary
    nodes_dict = json.loads(json_data)
    nodes = nodes_dict["Nodes"]
    nodes2 = f"{nodes}"
    
    # Send linked list nodes back to the client
    io.emit("getBreakpoints", nodes2 + "\n\n" + line, room=socket_id)


@io.event
def echo(socket_id: str, data: Any) -> None:
    print("Received message from", socket_id, ":", data)
    print("Echoing message back to client...")
    io.emit("echo", data, room=socket_id)


@io.event
def sendDummyData(socket_id: str, line_number: Any) -> None:
    print("Received message from", socket_id, ":", line_number)
    heap_dict = {}
    # Our initial linked list node has been alloced with data value 27
    if line_number == "100":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x0"
                }
            }
        }

    # Append the value 34 to the end of the list
    elif line_number == "101":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x2"
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "34",
                    "next": "0x0"
                }
            }
        }

    # Append the value 56 to the end of the list
    elif line_number == "102":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x2"
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "34",
                    "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "56",
                    "next": "0x0"
                }
            }
        }

    # Remove the second element from the linked list (i.e. remove 34)
    elif line_number == "103":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "56",
                    "next": "0x0"
                }
            }
        }
    
    # Append the value 72 to the start of the list (order of list nodes in heap_dict shouldn"t 
    # matter as long as the next pointers are in the correct order)
    elif line_number == "104":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "56",
                    "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "72",
                    "next": "0x1"
                }
            }
        }

    # Append the value 21 to the second element of the linked list 
    # (will be placed AFTER the second element i.e. the third element)
    elif line_number == "105":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x5"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "56",
                    "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "72",
                    "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "21",
                    "next": "0x3"
                }
            }
        }
    elif line_number == "106":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x5"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "72",
                    "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "21",
                    "next": "0x0"
                }
            }
        }
    elif line_number == "107":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x5"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "72",
                    "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "21",
                    "next": "0x6"
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "45",
                    "next": "0x0"
                }
            }
        }
    elif line_number == "108":
        heap_dict = {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "next": "0x5"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "21",
                    "next": "0x6"
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "45",
                    "next": "0x0"
                }
            }
        }

    else:
        heap_dict = "LINE NOT FOUND"

    retVal = f"{heap_dict}"
    io.emit("sendDummyData", retVal, room=socket_id)


eventlet.wsgi.server(eventlet.listen(("", 8001)), app)
