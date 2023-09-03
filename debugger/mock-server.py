'''
Scaffold for socketio client/server approach to handling program input/output.
This file is the socketio server.
See debugger/src/handle_program_io.py for the client side of this.
'''

import socketio
import eventlet
import subprocess

io = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(io)


@io.event
def compileAndStartGDB(socket_id: str) -> None:
    # 1. Compile user's C files into executable
    subprocess.run(["gcc", "-ggdb", *files, "-o", "program"])

    # 2. Run user's C program in GDB, keep open until debugging session ends
    # Involves running the python script `handle_program_io.py`
    subprocess.run(["gdb", "-x", "handle_program_io.py", "program"])


@io.event
def programInputServer(socket_id: str, data: str) -> None:
    # === 1. Receive input from the frontend user client console

    # === 2. Send it to the GDB instance
    io.emit("programInputGDB", data, room=get_sid_of_gdb_instance(socket_id))


@io.event
def programOutputServer(socket_id: str, user_socket_id: str, data: str) -> None:
    # === 1. Receive output from the program debugging session running in GDB instance
    # === 2. Send it to the frontend user client to display on console
    io.emit("programOutputUser", data, room=user_socket_id)


print("Starting server...")

eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
