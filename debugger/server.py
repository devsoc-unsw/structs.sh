'''
Must run in /debugger directory (because the gdb commands will source a python file by relative path)'''

import socketio
import eventlet
from typing import Any
import subprocess
import json

# Hard-coded variables for now.
# Later we want to receive the line numbers and file names from the client

# Line numbers that the user wants to set breakpoints on.
LINE_NUMBERS = ["28"]
FILE_NAMES = ["samples/linkedlist/main1.c", "samples/linkedlist/linkedlist.c"]
PROGRAM_NAME = "user_program"

# Should this go in server.py or in python interpretter running inside the
# gdb instance? Probably latter, because the state of
# the data structures is read within the gdb instance so it's easier to store
# the heap dictionary there as well.
heap_dict = {}


def compile_program(file_names: list[str]):
    subprocess.run(["gcc", "-ggdb", *file_names, "-o", PROGRAM_NAME])


def create_ll_script(line_numbers, program_name):
    gdb_script = f"""
source src/traverse-linked-list.py
python NodeListCommand("nodelist", "l")

file {program_name}
""" \
+ "\n".join([f"break {n}" for n in line_numbers]) \
        + f"""
run
nodelist
continue
quit
"""
    return gdb_script


def create_ll_script_2(program_name):
    gdb_script = f"""
source src/linked-list-things.py
# python info_functions_output = gdb.execute("info functions -n", False, True)
# python my_functions = parseFunctionNames(info_functions_output)
# python breakOnUserFunctions(my_functions)

python StepCommand("my_next", my_functions)

file {program_name}
start
python newHeapDict = myNext()
python print(newHeapDict)

"""
    return gdb_script


io = socketio.Server(cors_allowed_origins='*')


@io.event
def connect(socket_id: str, *_) -> None:
    print("Client connected: ", socket_id)


@io.event
def disconnect(socket_id: str) -> None:
    print("Client disconnected: ", socket_id)


@io.event
def getBreakpoints(socket_id: str, line_numbers: list[int], listName: list[str]) -> None:
    print("Received message from", socket_id)
    print("Echoing message back to client...")

    # Compile C program
    compile_program(FILE_NAMES)

    # Run GDB with the script
    gdb_script = create_ll_script(LINE_NUMBERS, PROGRAM_NAME)

    command = f"echo '{gdb_script}' | gdb -q"
    output = subprocess.check_output(command, shell=True).decode("utf-8")

    print(output)

    # Find the JSON data in the GDB output
    json_start = output.find("{")
    json_end = output.rfind("}") + 1
    json_data = output[json_start:json_end]

    # Parse the JSON data into a Python dictionary
    nodes_dict = json.loads(json_data)
    nodes = nodes_dict["Nodes"]
    nodes2 = f"{nodes}"

    # Send linked list nodes back to the client
    io.emit("getBreakpoints", nodes2, room=socket_id)


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
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x0'
                }
            }
        }

    # Append the value 34 to the end of the list
    elif line_number == "101":
        heap_dict = {
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x2'
                }
            },
            '0x2': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '34',
                    'next': '0x0'
                }
            }
        }

    # Append the value 56 to the end of the list
    elif line_number == "102":
        heap_dict = {
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x2'
                }
            },
            '0x2': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '34',
                    'next': '0x3'
                }
            },
            '0x3': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '56',
                    'next': '0x0'
                }
            }
        }

    # Remove the second element from the linked list (i.e. remove 34)
    elif line_number == "103":
        heap_dict = {
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x3'
                }
            },
            '0x3': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '56',
                    'next': '0x0'
                }
            }
        }

    # Append the value 72 to the start of the list (order of list nodes in heap_dict shouldn't
    # matter as long as the next pointers are in the correct order)
    elif line_number == "104":
        heap_dict = {
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x3'
                }
            },
            '0x3': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '56',
                    'next': '0x0'
                }
            },
            '0x4': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '72',
                    'next': '0x1'
                }
            }
        }

    # Append the value 21 to the second element of the linked list
    # (will be placed AFTER the second element i.e. the third element)
    elif line_number == "105":
        heap_dict = {
            '0x1': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '27',
                    'next': '0x5'
                }
            },
            '0x3': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '56',
                    'next': '0x0'
                }
            },
            '0x4': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '72',
                    'next': '0x1'
                }
            },
            '0x5': {
                'type': 'struct node',
                'is_pointer': 'false',
                'data': {
                    'value': '21',
                    'next': '0x3'
                }
            }
        }
    else:
        heap_dict = 'LINE NOT FOUND'

    retVal = f"{heap_dict}"
    io.emit("sendDummyData", retVal, room=socket_id)


@io.event
def mainDebug(socket_id: str) -> None:
    print("\n=== Running make to compile sample C programs...")
    command = "make --directory=samples clean; make --directory=samples all"
    ret = subprocess.run(command, capture_output=True, shell=True)
    compilation_out = ret.stdout.decode()
    print(compilation_out)

    # python print(user_fn_decls)
    print("\n=== Running gdb script...")
    gdb_script = f"""
    file samples/linkedlist/main1
    set python print-stack full
    set pagination off
    source src/parse_functions.py
    python pycparser_parse_fn_decls("{socket_id}")
    python print(f"Finished running pyxparser_parse_fn_decls in gdb instance")
    start
    """
    print(f"gdb_script:\n{gdb_script}")
    command = f"echo '{gdb_script}' | gdb -q"
    ret = subprocess.run(command, capture_output=True, shell=True, check=True)
    gdb_out = ret.stdout.decode()
    print(gdb_out)

    io.emit("mainDebug", f"Finished mainDebug:\n\n{gdb_out}")


@io.event
def createdFunctionDeclarations(socket_id: str, user_socket_id, function) -> None:
    print(f"Received function declaration from {user_socket_id}:")
    print(function)
    print("Sending function  declaration to client...")
    io.emit("sendFunctionDeclarations", function, room=user_socket_id)


print("Starting server...")
app = socketio.WSGIApp(io)
eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
# Server start will stall python script until server terminated
