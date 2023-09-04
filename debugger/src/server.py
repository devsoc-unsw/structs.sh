'''
Main debugger server. Hosts the socketio server and handles events from frontend
clients as well as gdb instance clients.

Must run in /debugger/src directory (because the gdb commands will source a python file by relative path e.g. ./gdb_scripts/linked_list_things.py)
'''

import os
import socketio
import eventlet
from typing import Any
import subprocess
import json

from placeholder_data import PLACEHOLDER_HEAP_DICTS

# Parent directory of this python script e.g. "/user/.../debugger/src"
# In the docker container this will be "/app/src"
# You can then use this to reference files relative to this directory.
abs_file_path = os.path.dirname(os.path.abspath(__file__))

# Hard-coded variables for now.
# Later we want to receive the line numbers and file names from the client

# Line numbers that the user wants to set breakpoints on.
LINE_NUMBERS = ["28"]
FILE_NAMES = [f"{abs_file_path}/samples/linkedlist/main1.c",
              f"{abs_file_path}/samples/linkedlist/linkedlist.c"]
USER_PROGRAM_NAME = f"{abs_file_path}/user_program"
TEST_PROGRAM_NAME = f"{abs_file_path}/samples/linkedlist/main1"

# Should this go in server.py or in python interpretter running inside the
# gdb instance? Probably latter, because the state of
# the data structures is read within the gdb instance so it's easier to store
# the heap dictionary there as well.
heap_dict = {}


def compile_program(file_names: list[str]):
    subprocess.run(["gcc", "-ggdb", *file_names, "-o", USER_PROGRAM_NAME])


def create_ll_script(line_numbers, program_name):
    gdb_script = f"""
source {abs_file_path}/gdb_scripts/traverse_linked_list.py
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
source {abs_file_path}/gdb_scripts/linked_list_things.py
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
    gdb_script = create_ll_script(LINE_NUMBERS, USER_PROGRAM_NAME)

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
    """
    Send hard-coded heap dictionaries to the frontend user.
    Mainly for development purposes.
    Supposing the GDB debug session is currently at `line_number` in the program.
    This function will send
    the heap dictionary at that point during the program's runtime.
    """
    print("Received message from", socket_id, ":", line_number)
    backend_dict = {}
    # Our initial linked list node has been alloced with data value 27
    if line_number == "100":
        backend_dict = PLACEHOLDER_HEAP_DICTS[0]
    elif line_number == "101":
        backend_dict = PLACEHOLDER_HEAP_DICTS[1]
    elif line_number == "102":
        backend_dict = PLACEHOLDER_HEAP_DICTS[2]
    elif line_number == "103":
        backend_dict = PLACEHOLDER_HEAP_DICTS[3]
    elif line_number == "104":
        backend_dict = PLACEHOLDER_HEAP_DICTS[4]
    elif line_number == "105":
        backend_dict = PLACEHOLDER_HEAP_DICTS[5]
    elif line_number == "106":
        backend_dict = PLACEHOLDER_HEAP_DICTS[6]
    elif line_number == "107":
        backend_dict = PLACEHOLDER_HEAP_DICTS[7]
    elif line_number == "108":
        backend_dict = PLACEHOLDER_HEAP_DICTS[8]
    else:
        backend_dict = "LINE NOT FOUND"

    retVal = f"{backend_dict}"
    io.emit("sendDummyData", retVal, room=socket_id)


@io.event
def mainDebug(socket_id: str) -> None:
    print("\n=== Running make to compile sample C programs....")
    command = "make --directory=src/samples clean; make --directory=src/samples all"
    ret = subprocess.run(command, capture_output=True, shell=True)
    compilation_out = ret.stdout.decode()
    print(compilation_out)

    # python print(user_fn_decls)
    print("\n=== Running gdb script...")
    gdb_script = f"""
    file {TEST_PROGRAM_NAME}
    set python print-stack full
    set pagination off
    source {abs_file_path}/gdb_scripts/parse_functions.py
    python print("fe client socket io")
    python print("{socket_id}")
    python pycparser_parse_fn_decls("{socket_id}")
    python pycparser_parse_type_decls("{socket_id}")
    start
    """
    print(f"gdb_script:\n{gdb_script}")

    stuff = []
    for line in gdb_script.split('\n'):
        stuff.append("-ex")
        stuff.append(line)

    # === Method 1: echo gdb_script to gdb and run gdb in a subprocess
    # command = f"echo '{gdb_script}' | gdb -q"
    # ret = subprocess.run(command, capture_output=True, shell=True, check=True)
    # gdb_out = ret.stdout.decode()
    # print(gdb_out)

    # === Method 2: use subprocess.Popen and Popen.communicate
    # TODO: subprocess.Popen and Popen.communicate
    subprocess.Popen(["gdb", "-batch", *stuff])

    io.emit("mainDebug", f"Finished mainDebug event on server-side")


@io.event
def createdFunctionDeclaration(socket_id: str, user_socket_id, function) -> None:
    print(f"Received function declaration from {user_socket_id}:")
    print(function)
    print("Sending function declaration to client...")
    io.emit("sendFunctionDeclaration", function, room=user_socket_id)


@io.event
def createdTypeDeclaration(socket_id: str, user_socket_id, type) -> None:
    print(f"Received type declaration from {user_socket_id}:")
    print(type)
    print("Sending type declaration to client...")
    io.emit("sendTypeDeclaration", type, room=user_socket_id)


print("Starting server...")
app = socketio.WSGIApp(io)
eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
# Server start will stall python script until server terminated
