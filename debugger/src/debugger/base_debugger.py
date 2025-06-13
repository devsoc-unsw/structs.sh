import os
from asyncio import (
    Event,
    Semaphore,
    create_subprocess_exec,
    create_task,
    iscoroutinefunction,
    to_thread,
)
from asyncio.subprocess import PIPE, DEVNULL
from contextlib import suppress
from pathlib import Path
from termios import ECHO, TCSADRAIN, tcgetattr, tcsetattr
from typing import Callable, Coroutine, assert_never

from . import mi
from .tributary import Tributary


class BaseDebugger:
    def __init__(self) -> None:
        async def noop(*args, **kwargs):
            pass

        self._handle_ea: Callable[[mi.ExecAsync], Coroutine] = noop
        self._hanlde_sa: Callable[[mi.StatusAsync], Coroutine] = noop
        self._handle_na: Callable[[mi.NotifyAsync], Coroutine] = noop

        self._inferior_handler: Callable[[str], Coroutine] = noop
        self._inferior_dispatch_done = Event()
        self._inferior_dispatch_done.set()

        self._inflight_cmds = Tributary[mi.Result]()

        self._console_buf = list[str]()
        self._console_sem = Semaphore(1)

        self._did_init = False

    async def init(self, executable_path: str) -> None:
        self.fd_master, self.fd_slave = os.openpty()
        _disable_echo(self.fd_slave)
        self.process = await create_subprocess_exec(
            "nsjail",
            "--config",
            Path(__file__).parent.parent.parent / "nsjail_gdb.cfg",
            "--",
            "/usr/bin/gdb",
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
            stderr=DEVNULL,
        )

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

        os.close(self.fd_master)
        os.close(self.fd_slave)
        await self._inferior_dispatch_done.wait()

        await self._inflight_cmds.join()

    async def run_command(self, command: str):
        chan = self._inflight_cmds.make_chan()

        self.process.stdin.write(f"{chan}{command}\n".encode())
        await self.process.stdin.drain()

        result = await self._inflight_cmds.get(chan)
        self._inflight_cmds.close_chan(chan)

        if result.kind == "error":
            raise ValueError(result.results["msg"])
        return result.results

    async def inf_send(self, msg: str):
        await to_thread(os.write, self.fd_master, msg.encode())

    async def console(self, command: str):
        """
        Run normal gdb (non-mi) commands.
        """

        async with self._console_sem:
            self._console_buf.clear()
            await self.run_command(f'-interpreter-exec console "{command}"')
            return "".join(self._console_buf)

    def on_exec_async(self, func: Callable[[mi.ExecAsync], Coroutine]):
        self._handle_ea = _asyncify(func)
        return func

    def on_status_async(self, func: Callable[[mi.StatusAsync], Coroutine]):
        self._hanlde_sa = _asyncify(func)
        return func

    def on_notify_async(self, func: Callable[[mi.NotifyAsync], Coroutine]):
        self._handle_na = _asyncify(func)
        return func

    def on_inf(self, func: Callable[[str], None]):
        """inf = inferior output"""
        self._inferior_handler = _asyncify(func)

    async def _stdout_dispatch(self) -> None:
        while line := await self.process.stdout.readline():
            for resp in mi.parse(line):
                match resp:
                    case mi.Result(token=t, kind=k, results=r):
                        await self._inflight_cmds.put(t, resp)
                    case mi.ExecAsync(token=t, kind=k, output=o):
                        await self._handle_ea(resp)
                    case mi.StatusAsync(token=t, kind=k, output=o):
                        await self._hanlde_sa(resp)
                    case mi.NotifyAsync(token=t, kind=k, output=o):
                        await self._handle_na(resp)
                    case mi.ConsoleStream(msg=m):
                        if self._console_sem.locked():
                            self._console_buf.append(m)
                    case mi.TargetStream(msg=m):
                        pass
                    case mi.LogStream(msg=m):
                        pass
                    case _:
                        assert_never(resp)

    async def _inf_dispatch(self) -> None:
        self._inferior_dispatch_done.clear()
        with suppress(OSError):
            while output := await to_thread(os.read, self.fd_master, 512):
                await self._inferior_handler(output.decode())
        self._inferior_dispatch_done.set()


def _disable_echo(fd: int):
    """
    Prevent reading what we ourselves wrote to the fd, i.e.,

    ```
    os.write(fd_master, "hello")
    msg = os.read(fd_master)  # should NOT be `"hello"`
    ```
    """

    old = tcgetattr(fd)
    new = tcgetattr(fd)

    new[3] &= ~ECHO
    tcsetattr(fd, TCSADRAIN, new)

    return old


def _asyncify(func: Callable):
    if iscoroutinefunction(func):
        return func

    async def wrap(*args, **kwargs):
        func(*args, **kwargs)

    return wrap
