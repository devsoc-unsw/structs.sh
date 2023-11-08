import os
import pty
import select
from typing import Optional
import gdb

from src.constants import TIMEOUT_DURATION
from src.gdb_scripts.use_socketio_connection import (
    useSocketIOConnection,
    enable_socketio_client_emit,
)


class IOManager:
    max_read_bytes = 24 * 1024

    def __init__(self, user_socket_id: str = None):
        (master, slave) = pty.openpty()
        self.stdin = master
        self.stdout = master
        self.name = os.ttyname(slave)
        self.user_socket_id = user_socket_id
        gdb.execute(f"tty {self.name}")

    def read(self) -> Optional[str]:
        (data_to_read, _, _) = select.select([self.stdout], [], [], TIMEOUT_DURATION)
        if data_to_read:
            return os.read(self.stdout, self.max_read_bytes).decode()
        else:
            return None

    def check_is_waiting_for_input(self) -> bool:
        """
        Check whether the program stdin is waiting for user input.
        Note: This attempt does not work. It always returns True even when the program is not waiting for input, because the program is always waiting for input to be buffered.
        """
        (_, data_to_write, _) = select.select([], [self.stdin], [], TIMEOUT_DURATION)
        return bool(data_to_write)

    def write(self, data: str):
        os.write(self.stdin, data.encode())

    def read_and_send(self):
        output = self.read()
        sendProgramOutputToServer(user_socket_id=self.user_socket_id, output=output)


@useSocketIOConnection
def sendProgramOutputToServer(user_socket_id: str = None, output: str = "", sio=None):
    if output and user_socket_id:
        sio.emit("produced_stdout_output", (user_socket_id, output))
        enable_socketio_client_emit()
    else:
        print("No output from program stdout")
