import socketio
import eventlet
from typing import Any

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
def compileCode(socket_id: str, data: Any) -> None:
    print("Received code from", socket_id, ":", data)
    print("Echoing code back to client...")
    io.emit("compileCode", data, room=socket_id)

@io.event
def stdInput(socket_id: str, data: Any) -> None:
    print("Received standard input from", socket_id, ":", data)
    print("Echoing standard input back to client...")
    io.emit("stdInput", data, room=socket_id)

eventlet.wsgi.server(eventlet.listen(("", 5001)), app)
