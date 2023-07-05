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


io = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(io)


@io.event
def connect(socket_id: str, *_) -> None:
    print("Client connected: ", socket_id)


@io.event
def disconnect(socket_id: str) -> None:
    print("Client disconnected: ", socket_id)
    

@io.event
def getBreakpoints(socket_id: str, data: Any) -> None:
    print("Received message from", socket_id, ":", data)
    print("Echoing message back to client...")

    # Run GDB with the script
    command = f"echo '{gdb_script}' | gdb -q"
    output = subprocess.check_output(command, shell=True).decode("utf-8")

    # Find the JSON data in the GDB output
    json_start = output.find("{")
    json_end = output.rfind("}") + 1
    json_data = output[json_start:json_end]

    # Parse the JSON data into a Python dictionary
    nodes_dict = json.loads(json_data)
    nodes = nodes_dict["Nodes"]
    nodes2 = f"{nodes}"
    
    #io.emit("getBreakpoints", data, room=socket_id)
    io.emit("getBreakpoints", nodes2 + '\n\n' + data, room=socket_id)


@io.event
def echo(socket_id: str, data: Any) -> None:
    print("Received message from", socket_id, ":", data)
    print("Echoing message back to client...")
    io.emit("echo", data, room=socket_id)


eventlet.wsgi.server(eventlet.listen(("", 8000)), app)
