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


eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
