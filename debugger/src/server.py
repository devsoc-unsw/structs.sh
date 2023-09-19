'''
Main debugger server. Hosts the socketio server and handles events from frontend
clients as well as gdb instance clients.

Must run in /debugger/src directory (because the gdb commands will source a python file by relative path e.g. ./gdb_scripts/linked_list_things.py)
'''

import os
from pprint import pprint
import socketio
import eventlet
from typing import Any
import subprocess
import json
from src.constants import CUSTOM_NEXT_COMMAND_NAME
from src.utils import make_non_blocking, compile_program, get_gdb_script, get_subprocess_output, create_ll_script, create_ll_script_2
from src.placeholder_data import PLACEHOLDER_BACKEND_STATES

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
TEST_PROGRAM_NAME = f"{abs_file_path}/samples/linkedlist/main3"
GDB_SCRIPT_NAME = "test_stdout"  # Can just use "default"

TIMEOUT_DURATION = 0.3

'''
Map from a FE client socket_id to the subprocess that is running a gdb instance
E.g.
procs = {
    "socket_id_1": <subprocess.Popen object at 0x7f9b1c0b5d90>,
    ...
}
'''
procs = {}

io = socketio.Server(cors_allowed_origins='*')


@io.event
def connect(socket_id: str, *_) -> None:
    print("Client connected: ", socket_id)


@io.event
def disconnect(socket_id: str) -> None:
    print("Client disconnected: ", socket_id)


@io.event
def getBreakpoints(socket_id: str, line_numbers: list[int], listName: list[str]) -> None:
    print("Received message from", socket_id, "at event getBreakpoints")
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
    print("Received message from", socket_id, ":",
          line_number, "at event sendDummyData")
    backend_dict = {}
    # Our initial linked list node has been alloced with data value 27
    if line_number == "100":
        backend_dict = PLACEHOLDER_BACKEND_STATES[0]
    elif line_number == "101":
        backend_dict = PLACEHOLDER_BACKEND_STATES[1]
    elif line_number == "102":
        backend_dict = PLACEHOLDER_BACKEND_STATES[2]
    elif line_number == "103":
        backend_dict = PLACEHOLDER_BACKEND_STATES[3]
    elif line_number == "104":
        backend_dict = PLACEHOLDER_BACKEND_STATES[4]
    elif line_number == "105":
        backend_dict = PLACEHOLDER_BACKEND_STATES[5]
    elif line_number == "106":
        backend_dict = PLACEHOLDER_BACKEND_STATES[6]
    elif line_number == "107":
        backend_dict = PLACEHOLDER_BACKEND_STATES[7]
    elif line_number == "108":
        backend_dict = PLACEHOLDER_BACKEND_STATES[8]
    else:
        backend_dict = "LINE NOT FOUND"

    io.emit("sendDummyData", backend_dict, room=socket_id)


@io.event
def mainDebug(socket_id: str) -> None:
    print("\n=== Running make to compile sample C programs....")
    command = "make --directory=src/samples clean; make --directory=src/samples all"
    ret = subprocess.run(command, capture_output=True, shell=True)
    compilation_out = ret.stdout.decode()
    print(compilation_out)

    gdb_script = get_gdb_script(
        TEST_PROGRAM_NAME, abs_file_path, socket_id, script_name=GDB_SCRIPT_NAME)
    print("\n=== Running gdb script...")
    print(f"gdb_script:\n{gdb_script}")

    commands = []
    for line in gdb_script.strip().split('\n'):
        commands.append("-ex")
        commands.append(line)

    # === Method 1: echo gdb_script to gdb and run gdb in a subprocess
    # command = f"echo '{gdb_script}' | gdb -q"
    # ret = subprocess.run(command, capture_output=True, shell=True, check=True)
    # gdb_out = ret.stdout.decode()
    # print(gdb_out)

    # === Method 2: Use subprocess.Popen to start a gdb instance and pass in a
    # list of commands to gdb.
    # proc = subprocess.Popen(["gdb", "-batch", *commands], stdin=subprocess.PIPE,
    #                         stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=False)

    # === Method 3: Use subprocess.Popen to start a gdb instance and write to
    # subprocess.Popen.stdin in a loop. Also enables reading the output from
    # subprocess.Popen.stdout
    proc = subprocess.Popen(["gdb"], stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, shell=False)

    # Make subprocess writer streams non-blocking
    make_non_blocking(proc.stdout)
    if proc.stderr:
        make_non_blocking(proc.stderr)

    procs[socket_id] = proc

    for line in map(lambda line: line.strip(), gdb_script.strip().split('\n')):
        proc.stdin.write(line + '\n')
        proc.stdin.flush()
        print("\n=== Wrote one line to gdb debugging session: ", line)

        # Read any output from the gdb instance after writing a line to it.
        get_subprocess_output(proc, TIMEOUT_DURATION)

    io.emit("mainDebug", f"Finished mainDebug event on server")


@io.event
def executeNext(socket_id: str) -> None:
    proc: subprocess.Popen = procs[socket_id]
    if proc is None:
        print(f"ERROR: No gdb instance running for socket_id {socket_id}")
        return

    print(f"process at FE client socket_id {socket_id}:")
    print(proc)

    print(
        f"\n=== Sending '{CUSTOM_NEXT_COMMAND_NAME}' command to gdb instance {proc.pid}")
    proc.stdin.write(f'{CUSTOM_NEXT_COMMAND_NAME}\n')
    proc.stdin.flush()
    get_subprocess_output(proc, TIMEOUT_DURATION)

    # Reading new output from the program relies on the fact that next was
    # executed just before. This is expected to happen in the call to the custom
    # next command above.
    proc.stdin.write(f'python io_manager.read_and_send()\n')
    proc.stdin.flush()
    get_subprocess_output(proc, TIMEOUT_DURATION)

    io.emit("executeNext", f"Finished executeNext event on server-side")


@io.event
def send_stdin(socket_id: str):
    '''
    TODO: Send stdin from FE client to gdb instance'''
    print('send_stdin event not yet implemented')


@io.event
def createdFunctionDeclaration(socket_id: str, user_socket_id, function) -> None:
    '''
    Event to receive parsed function declaration from gdb instance and 
    send it to the specified frontend client.
    '''
    print(
        f"Event createdFunctionDeclaration received from gdb instance with socket_id {socket_id}:")
    print(f"Sending function declaration to client {user_socket_id}:")
    print(function)
    io.emit("sendFunctionDeclaration", function, room=user_socket_id)


@io.event
def createdTypeDeclaration(socket_id: str, user_socket_id, type) -> None:
    '''
    Event to receive parsed type declaration (struct, typedef) from gdb instance and 
    send it to the specified frontend client.
    '''
    print(f"Received type declaration from {user_socket_id}:")
    print(type)
    print("Sending type declaration to client...")
    io.emit("sendTypeDeclaration", type, room=user_socket_id)


@io.event
def updatedBackendState(socket_id: str, user_socket_id, backend_data) -> None:
    '''
    Event to send the current backend state (including stack and heap data) to
    the specified frontend client.
    Should be emitted by a gdb instance while running a `custom_next` custom command.
    '''
    print(
        f"Event updatedBackendState received from gdb instance with socket_id {socket_id}:")
    print(f"Sending backend state to client {user_socket_id}:")
    pprint(backend_data)
    io.emit("sendBackendStateToUser", backend_data, room=user_socket_id)


@io.event
def produced_stdout_output(socket_id: str, user_socket_id: str, data: str):
    '''
    Send program stdout to FE client
    '''
    print(
        f"Event produced_stdout_output received from gdb instance with socket_id {socket_id}:")
    print(f"Sending stdout output to client {user_socket_id}:")
    print(data)
    io.emit("sendStdoutToUser", data, room=user_socket_id)


print("Starting server...")
app = socketio.WSGIApp(io)
eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
# Server start will block python script until server terminated
