'''
Scaffold for socketio client/server approach to handling program input/output.
This file is the socketio client. Run in the GDB instance using `source handle_program_io.py`.
See debugger/mock-server.py for the server side of this.
'''

import gdb
import socketio


# This python script gets run in the gdb instance
# Create a socketIO client and connect to the server
sio = socketio.Client()
sio.connect("http://localhost:8000")


@sio.on('programInputGDB')
def programInputGDB(data):
    # === 1. Receive input from the server

    # === 2. Run the input in the GDB instance

    # === 3. Get output from the GDB instance

    # === 4. Send the output to the server
    sio.emit("programOutputServer", output)
