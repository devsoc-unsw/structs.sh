import os
import pty
import select
from typing import Optional
import gdb

from src.constants import TIMEOUT_DURATION
from src.gdb_scripts.use_socketio_connection import useSocketIOConnection, enable_socketio_client_emit


class IOManager:
    max_read_bytes = 24 * 1024

    def __init__(self, user_socket_id: str = None):
        print("\nInitializing IOManager instance...")
        
        self.user_socket_id = user_socket_id

        # Create a new pseudo-terminal (pty) pair, returning two file descriptors,
        # one for each end of the pty.
        (master_fd, slave_fd) = pty.openpty()

        # Unlike the slave side, the master side does not have a virtual
        # terminal associated with it.
        # The master side can be thought of as a communication interface or a
        # handle to control the slave terminal, not as a terminal itself.
        # The master side of a PTY acts as the controlling side. Programs that
        # communicate with the terminal, such as debuggers or terminal emulators,
        # write to and read from the master side.
        self.master_fd = master_fd

        # The slave side has a name that represents a virtual terminal
        # (e.g., /dev/pts/3), which is used by the operating system to refer to
        # it. The master side typically does not have a name that can be
        # retrieved using os.ttyname()
        # This line redirects the input and output of the program being debugged
        # to the slave side of the pseudo-terminal created previously
        # (e.g. /dev/pts/X)
        gdb.execute(f"tty {os.ttyname(slave_fd)}")

    def read(self) -> Optional[str]:
        (data_to_read, _, _) = select.select(
            [self.master_fd], [], [], TIMEOUT_DURATION)
        if data_to_read:
            return os.read(self.master_fd, self.max_read_bytes).decode()
        else:
            return None

    def check_is_waiting_for_input(self) -> bool:
        '''
        Check whether the program stdin is waiting for user input.
        Note: This attempt does not work. It always returns True even when the program is not waiting for input, because the program is always waiting for input to be buffered.
        '''
        (_, data_to_write, _) = select.select(
            [], [self.master_fd], [], TIMEOUT_DURATION)
        print(
            "=======================================\n=================================\n")
        print(f"{data_to_write=}")
        return bool(data_to_write)

    def write(self, data: str):
        os.write(self.master_fd, data.encode())

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
