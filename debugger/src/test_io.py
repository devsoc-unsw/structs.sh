import pty
import os
import select
from typing import Optional
from time import sleep


class IOManager:
    max_read_bytes = 24 * 1024

    def __init__(self):
        (master, slave) = pty.openpty()
        self.stdin = master
        self.stdout = master
        self.name = os.ttyname(slave)

    def read(self) -> Optional[str]:
        (data_to_read, _, _) = select.select([self.stdout], [], [], 1)
        if data_to_read:
            return os.read(self.stdout, self.max_read_bytes).decode()
        else:
            return None

    def write(self, data: str):
        os.write(self.stdin, data.encode())


import gdb

if __name__ == "__main__":
    pty = IOManager()
    outputs = []
    gdb.execute(f"tty {pty.name}")
    pty.write("1 2\n")
    pty.write("Hello\n")

    gdb.execute("b 19")
    gdb.execute("b 21")
    gdb.execute("b 23")
    gdb.execute("b 24")
    gdb.execute("run")
    outputs.append(pty.read())
    pty.write("foo foo\n")
    pty.write("a")

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    print(outputs)
