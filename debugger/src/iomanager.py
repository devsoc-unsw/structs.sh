import os
import pty
import select
from typing import Optional


class IOManager:
    max_read_bytes = 24 * 1024

    def __init__(self):
        (master, slave) = pty.openpty()
        self.stdin = master
        self.stdout = master
        self.name = os.ttyname(slave)

    def read(self) -> Optional[str]:
        (data_to_read, _, _) = select.select([self.stdout], [], [], 0)
        if data_to_read:
            return os.read(self.stdout, self.max_read_bytes).decode()
        else:
            return None

    def write(self, data: str):
        os.write(self.stdin, data.encode())
