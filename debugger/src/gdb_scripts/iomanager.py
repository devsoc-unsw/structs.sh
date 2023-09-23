import os
import pty
import select
from typing import Optional
import gdb

from src.gdb_scripts.use_socketio_connection import useSocketIOConnection, enable_socketio_client_emit


class IOManager:
    max_read_bytes = 24 * 1024

    def __init__(self, user_socket_id: str = None):
        print("\nInitializing IOManager instance...")
        (master, slave) = pty.openpty()
        self.stdin = master
        self.stdout = master
        self.name = os.ttyname(slave)
        self.user_socket_id = user_socket_id
        gdb.execute(f"tty {self.name}")

    def read(self) -> Optional[str]:
        (data_to_read, _, _) = select.select([self.stdout], [], [], 0)
        if data_to_read:
            return os.read(self.stdout, self.max_read_bytes).decode()
        else:
            return None

    def write(self, data: str):
        os.write(self.stdin, data.encode())

    def read_and_send(self):
        output = self.read()
        sendProgramOutputToServer(
            user_socket_id=self.user_socket_id, output=output)


@useSocketIOConnection
def sendProgramOutputToServer(user_socket_id: str = None, output: str = "", sio=None):
    if output and user_socket_id:
        print(
            f"Sending program stdout output to server, for user with socket_id {user_socket_id}")
        sio.emit("produced_stdout_output",
                 (user_socket_id, output))
        enable_socketio_client_emit()
    else:
        print("No output from program stdout")
