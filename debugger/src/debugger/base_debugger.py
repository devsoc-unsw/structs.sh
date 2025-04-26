import os
from asyncio import (
    Event,
    Queue,
    create_subprocess_exec,
    create_task,
    gather,
    iscoroutinefunction,
    to_thread,
)
from asyncio.subprocess import PIPE
from collections import deque
from contextlib import suppress
from pathlib import Path
from termios import ECHO, TCSADRAIN, tcgetattr, tcsetattr
from typing import Callable

from . import mion


class BaseDebugger:
    def __init__(self) -> None:
        do_nothing = lambda *args, **kwargs: None
        self.oob_handler: Callable[[tuple[str, any]], any] = do_nothing
        self.inferior_handler: Callable[[str], any] = do_nothing
        self._inferior_dispatch_done = Event()
        self._inferior_dispatch_done.set()
        self._did_init = False

    async def init(self, executable_path: str | Path) -> None:
        self.fd_master, self.fd_slave = os.openpty()
        _disable_echo(self.fd_slave)
        self.process = await create_subprocess_exec(
            "gdb",
            "--interpreter=mi4",
            "--quiet",
            "-nx",
            "-nh",
            "--tty",
            os.ttyname(self.fd_slave),
            "--args",
            str(executable_path),
            stdin=PIPE,
            stdout=PIPE,
        )

        self.cmd_ident = 0
        self.pending_cmds = dict[str, Queue[tuple[str, dict]]]()
        self.stream_queue = deque[str](maxlen=0)
        create_task(self._stdout_dispatch())
        create_task(self._inf_dispatch())
        self._did_init = True
        return self

    async def deinit(self) -> None:
        if not self._did_init:
            return

        self.process.stdin.write_eof()
        await self.process.stdin.drain()
        await self.process.wait()

        for queue in self.pending_cmds.values():
            queue.shutdown()
        await gather(*[queue.join() for queue in self.pending_cmds.values()])

        os.close(self.fd_master)
        os.close(self.fd_slave)
        await self._inferior_dispatch_done.wait()

    async def run_command(self, command: str):
        ident = str(self.cmd_ident).rjust(3, "0")
        self.cmd_ident = (1 + self.cmd_ident) % 256
        assert ident not in self.pending_cmds
        self.pending_cmds[ident] = Queue(1)

        self.process.stdin.write(f"{ident}{command}\n".encode())
        await self.process.stdin.drain()

        subkind, result = await self.pending_cmds[ident].get()
        self.pending_cmds[ident].task_done()
        del self.pending_cmds[ident]

        if subkind == mion.RESULT_ERROR:
            raise ValueError(result["msg"])
        assert subkind in mion.RESULT_CLASS
        return result

    async def inf_send(self, msg: str):
        await to_thread(os.write, self.fd_master, msg.encode())

    async def console(self, command: str):
        """Experimental"""

        self.stream_queue = deque[str](maxlen=None)
        self.process.stdin.write(
            f'-interpreter-exec console "{command}"\n'.encode()
        )

        subkind, result = await self.result_queue.get()
        self.result_queue.task_done()
        if subkind == mion.RESULT_ERROR:
            raise ValueError(result["msg"])
        assert subkind in mion.RESULT_CLASS
        assert result == {}

        res = "".join(
            line[1:-1].encode().decode("unicode_escape")
            for line in self.stream_queue
        )
        self.stream_queue = deque[str](maxlen=0)
        return res

    def on_oob(self, func: Callable[[tuple[str, any]], any]):
        """oob = out of band"""
        self.oob_handler = func
        return func

    def on_inf(self, func: Callable[[str], any]):
        """inf = inferior output"""
        self.inferior_handler = func
        return func

    async def _stdout_dispatch(self) -> None:
        while line := await self.process.stdout.readline():
            line = line.strip().decode()
            if line == "(gdb)":
                continue

            kind, message = line[:1], line[1:]
            match kind:
                case c if c.isdigit():
                    ident, kind, message = line[:3], line[3:4], line[4:]
                    assert kind == mion.RESULT

                    subkind, message = _split_subkind(message)
                    await self.pending_cmds[ident].put(
                        (subkind, mion.loads(message))
                    )
                case _ if kind in mion.ASYNC:
                    subkind, message = _split_subkind(message)
                    if iscoroutinefunction(self.oob_handler):
                        await self.oob_handler((subkind, mion.loads(message)))
                    else:
                        self.oob_handler((subkind, mion.loads(message)))
                case _ if kind in mion.STREAM:
                    self.stream_queue.append(message)
                case _:
                    raise ValueError(
                        f"Received unknown message kind from GDB: {kind}"
                    )

    async def _inf_dispatch(self) -> None:
        self._inferior_dispatch_done.clear()
        with suppress(OSError):
            while output := await to_thread(os.read, self.fd_master, 512):
                if iscoroutinefunction(self.inferior_handler):
                    await self.inferior_handler(output.decode())
                else:
                    self.inferior_handler(output.decode())
        self._inferior_dispatch_done.set()


def _split_subkind(message: str) -> tuple[str, str]:
    """
    >>> _split_subkind('abc')
    ('abc', '')
    >>> _split_subkind('abc,def')
    ('abc', 'def')
    >>> _split_subkind('abc,def,ghi')
    ('abc', 'def,ghi')
    """

    if "," in message:
        return tuple(message.split(",", 1))
    return message, ""


def _disable_echo(fd: int):
    """
    Prevent reading what we ourselves wrote to the fd
    """

    old = tcgetattr(fd)
    new = tcgetattr(fd)

    new[3] &= ~ECHO
    tcsetattr(fd, TCSADRAIN, new)

    return old
