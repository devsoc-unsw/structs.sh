import socketio
import eventlet
from typing import Any
import json

io = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(io)


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
def get_breakpoints(socket_id: str, breakpoints_in: Any) -> None:
    print("Received on get_breakpoints")
    print(breakpoints_in)
    # breakpoints_json = json.load(breakpoints_in)
    # breakpoints = breakpoints_json["breakpoints"]
    breakpoints = breakpoints_in["breakpoints"]
    print(breakpoints)
    if len(breakpoints) == 0:
        io.emit("breakpoints", "No breakpoints provided/incorrect format", room=socket_id)
    else:
        # TODO: Once the session manager is complete tell the correct instance of gdb these breakpoints
        io.emit("breakpoints", "Breakpoints received and being registered", room=socket_id)


eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
