"""
Main debugger server. Hosts the socketio server and handles events from frontend
clients as well as gdb instance clients.

Must run in /debugger/src directory (because the gdb commands will source a python file by relative path e.g. ./gdb_scripts/custom_next.py)
"""

import os
import uuid
from pprint import pprint
import socketio
import eventlet
from typing import Any
import subprocess
from placeholder_data import (
    PLACEHOLDER_BACKEND_STATES_BINARY_TREE,
    PLACEHOLDER_BACKEND_STATES_LINKED_LIST,
)
from src.constants import CUSTOM_NEXT_COMMAND_NAME, DEBUG_SESSION_VAR_NAME
from src.utils import make_non_blocking, get_gdb_script, get_subprocess_output

# Parent directory of this python script e.g. "/user/.../debugger/src"
# In the docker container this will be "/app/src"
# You can then use this to reference files relative to this directory.
abs_file_path = os.path.dirname(os.path.abspath(__file__))

GDB_SCRIPT_NAME = "default"  # Can just use "default"
TEST_PROGRAM_NAME = f"{abs_file_path}/samples/linkedlist/main3"

TIMEOUT_DURATION = 0.3

"""
Map from a FE client socket_id to the subprocess that is running a gdb instance
E.g.
procs = {
    "socket_id_1": <subprocess.Popen object at 0x7f9b1c0b5d90>,
    ...
}
"""
procs = {}

io = socketio.Server(cors_allowed_origins="*")


@io.event
def connect(socket_id: str, *_) -> None:
    print("Client connected: ", socket_id)


@io.event
def disconnect(socket_id: str) -> None:
    print("Client disconnected: ", socket_id)


@io.event
def echo(socket_id: str, data: Any) -> None:
    print("Received message from", socket_id, ":", data)
    print("Echoing message back to client...")
    io.emit("echo", data, room=socket_id)


@io.event
def sendDummyLinkedListData(socket_id: str, line_number: int) -> None:
    """
    Send hard-coded heap dictionaries to the frontend user.
    Mainly for development purposes.
    Supposing the GDB debug session is currently at `line_number` in the program.
    This function will send
    the heap dictionary at that point during the program's runtime.
    """
    print(
        "Received message from", socket_id, ":", line_number, "at event sendDummyData"
    )
    backend_dict = {}
    # Our initial linked list node has been alloced with data value 27
    if line_number == 100:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[0]
    elif line_number == 101:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[1]
    elif line_number == 102:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[2]
    elif line_number == 103:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[3]
    elif line_number == 104:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[4]
    elif line_number == 105:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[5]
    elif line_number == 106:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[6]
    elif line_number == 107:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[7]
    elif line_number == 108:
        backend_dict = PLACEHOLDER_BACKEND_STATES_LINKED_LIST[8]
    else:
        backend_dict = "LINE NOT FOUND"

    io.emit("sendDummyLinkedListData", backend_dict, room=socket_id)


@io.event
def sendDummyBinaryTreeData(socket_id: str, line_number: int) -> None:
    """
    Send hard-coded heap dictionaries to the frontend user.
    Mainly for development purposes.
    Supposing the GDB debug session is currently at `line_number` in the program.
    This function will send
    the heap dictionary at that point during the program's runtime.
    """
    print(
        "Received message from", socket_id, ":", line_number, "at event sendDummyData"
    )
    backend_dict = {}
    # Our initial linked list node has been alloced with data value 27
    if line_number == 100:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[0]
    elif line_number == 101:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[1]
    elif line_number == 102:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[2]
    elif line_number == 103:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[3]
    elif line_number == 104:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[4]
    elif line_number == 105:
        backend_dict = PLACEHOLDER_BACKEND_STATES_BINARY_TREE[5]
    else:
        backend_dict = "LINE NOT FOUND"

    io.emit("sendDummyBinaryTreeData", backend_dict, room=socket_id)


@io.event
def mainDebug(socket_id: str, code: str) -> None:
    # TODO: handle deletion of code files
    # TODO: move code to a different directory (not in samples since it is binded to the docker container)
    new_code_dir = os.path.join(
        abs_file_path, "samples", "user", str(uuid.uuid4()))
    os.mkdir(new_code_dir)
    new_code_path = os.path.join(new_code_dir, "main.c")
    new_binary_path = os.path.join(new_code_dir, "main")
    # os.chdir(new_code_dir)
    with open(new_code_path, "w", encoding="utf-8") as f:
        f.write(code)

    compilation_process = subprocess.run(
        ["gcc", "-ggdb", new_code_path, "-o", new_binary_path],
        capture_output=True,
    )

    if compilation_process.stderr:
        io.emit("compileError", compilation_process.stderr.decode())
        return

        
    # compilation_out = ret.stdout.decode()
    # print(compilation_out)

    # print("\n=== Running make to compile sample C programs....")
    # command = "make --directory=src/samples clean; make --directory=src/samples all"
    # ret = subprocess.run(command, capture_output=True, shell=True)
    # compilation_out = ret.stdout.decode()
    # print(compilation_out)

    # == compile user's c program'

    gdb_script = get_gdb_script(
        new_binary_path, abs_file_path, socket_id, script_name=GDB_SCRIPT_NAME
    )
    print("\n=== Running gdb script...")
    print(f"gdb_script:\n{gdb_script}")

    proc = subprocess.Popen(
        ["gdb"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        shell=False,
    )

    # Make subprocess writer streams non-blocking
    make_non_blocking(proc.stdout)
    if proc.stderr:
        make_non_blocking(proc.stderr)

    procs[socket_id] = proc

    for line in map(lambda line: line.strip(), gdb_script.strip().split("\n")):
        proc.stdin.write(line + "\n")
        proc.stdin.flush()
        print("\n=== Wrote one line to gdb debugging session: ", line)

        # Read any output from the gdb instance after writing a line to it.
        get_subprocess_output(proc, TIMEOUT_DURATION)

    io.emit("mainDebug", f"Finished mainDebug event on server")


@io.event
def executeNext(socket_id: str) -> None:
    proc: subprocess.Popen = procs[socket_id]
    if proc is None:
        raise Exception(
            f"executeNext: No subprocess found for user with socket_id {socket_id}")

    print(f"Found subprocess for FE client socket_id {socket_id}:")
    print(proc)

    print(
        f"\n=== Sending '{CUSTOM_NEXT_COMMAND_NAME}' command to gdb instance {proc.pid}"
    )
    proc.stdin.write(f"{CUSTOM_NEXT_COMMAND_NAME}\n")
    proc.stdin.flush()
    get_subprocess_output(proc, TIMEOUT_DURATION)

    # Reading new output from the program relies on the fact that next was
    # executed just before. This is expected to happen in the call to the custom
    # next command above.
    proc.stdin.write(
        f"python {DEBUG_SESSION_VAR_NAME}.io_manager.read_and_send()\n")
    proc.stdin.flush()
    get_subprocess_output(proc, TIMEOUT_DURATION)

    io.emit("executeNext", f"Finished executeNext event on server-side")


@io.event
def send_stdin(socket_id: str, data: str):
    """
    Send stdin from FE client to gdb instance
    """

    proc: subprocess.Popen = procs[socket_id]
    if proc is None:
        raise Exception(
            f"executeNext: No subprocess found for user with socket_id {socket_id}")

    print(f"Found subprocess for FE client socket_id {socket_id}:")
    print(proc)

    print(f"Sending stdin to gdb instance {proc.pid}:")
    print(data)
    proc.stdin.write(
        f'python {DEBUG_SESSION_VAR_NAME}.io_manager.write("{data}\\n")\n')
    proc.stdin.flush()


@io.event
def createdFunctionDeclaration(socket_id: str, user_socket_id, function) -> None:
    """
    Event to receive parsed function declaration from gdb instance and
    send it to the specified frontend client.
    """
    print(
        f"Event createdFunctionDeclaration received from gdb instance with socket_id {socket_id}:"
    )
    print(f"Sending function declaration to client {user_socket_id}:")
    print(function)
    io.emit("sendFunctionDeclaration", function, room=user_socket_id)


@io.event
def createdTypeDeclaration(socket_id: str, user_socket_id, type) -> None:
    """
    Event to receive parsed type declaration (struct, typedef) from gdb instance and
    send it to the specified frontend client.
    """
    print(f"Received type declaration from {user_socket_id}:")
    print(type)
    print("Sending type declaration to client...")
    io.emit("sendTypeDeclaration", type, room=user_socket_id)


@io.on("programWaitingForInput")
def requestUserInput(socket_id: str, user_socket_id) -> None:
    print(
        f"Event requestUserInput received from gdb instance with socket_id {socket_id}:"
    )
    print(f"Requesting user input from FE user {user_socket_id}:")
    io.emit("requestUserInput", room=user_socket_id)


@io.event
def updatedBackendState(socket_id: str, user_socket_id, backend_data) -> None:
    """
    Event to send the current backend state (including stack and heap data) to
    the specified frontend client.
    Should be emitted by a gdb instance while running a `custom_next` custom command.
    """
    print(
        f"Event updatedBackendState received from gdb instance with socket_id {socket_id}:"
    )
    print(f"Sending backend state to client {user_socket_id}:")
    pprint(backend_data)
    io.emit("sendBackendStateToUser", backend_data, room=user_socket_id)


@io.event
def produced_stdout_output(socket_id: str, user_socket_id: str, data: str):
    """
    Send program stdout to FE client
    """
    print(
        f"Event produced_stdout_output received from gdb instance with socket_id {socket_id}:"
    )
    print(f"Sending stdout output to client {user_socket_id}:")
    print(data)
    io.emit("sendStdoutToUser", data, room=user_socket_id)


print("Starting server...")
app = socketio.WSGIApp(io)
eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
# Server start will block python script until server terminated
