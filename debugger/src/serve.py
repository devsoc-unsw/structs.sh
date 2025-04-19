from dataclasses import asdict
import json
from pprint import pp
from tempfile import mkstemp
from pathlib import Path
import logging
from logging import debug, info, warning, error, exception, critical
import os

from uvicorn import run
from socketio import AsyncServer
from socketio import ASGIApp

from debugger import Debugger, c_compile, CompileError

logging.basicConfig(level=logging.INFO)


server = AsyncServer(async_mode="asgi", cors_allowed_origins="*")


class User:
    async def init(self, src_code: str):
        fd, path = mkstemp(suffix=".c")
        os.close(fd)
        self.src = Path(path)

        fd, path = mkstemp()
        os.close(fd)
        self.exe = Path(path)

        self.src.write_text(src_code)
        try:
            await c_compile(self.src, self.exe)
        except CompileError:
            self.src.unlink()
            self.exe.unlink()
            raise

        self.dbg = Debugger()
        await self.dbg.init(self.exe)

        self.seen = set()  # legacy

    async def deinit(self):
        await self.dbg.deinit()
        self.exe.unlink()
        self.src.unlink()


user = dict[str, User]()


@server.event
async def connect(sid: str, environ: dict) -> None:
    info(f"[{sid}] connect")


@server.event
async def disconnect(sid: str) -> None:
    if sid in user:
        await user[sid].deinit()
        del user[sid]

    info(f"[{sid}] disconnect")


@server.event
async def echo(sid: str, data: any) -> None:
    info(f"[{sid}] echo '{data}'")
    await server.emit("echo", data=data, to=sid)


@server.event
async def mainDebug(sid: str, code: str) -> None:
    if sid in user:
        await user[sid].deinit()
        del user[sid]

    user[sid] = User()
    try:
        await user[sid].init(code)
    except CompileError as e:
        del user[sid]
        info(f"[{sid}] compile error")
        await server.emit("compileError", e.stderr, to=sid)
        return

    for func in await user[sid].dbg.functions():
        await user[sid].dbg.breakpoint(func)
    await user[sid].dbg.run()

    info(f"[{sid}] compiled code")
    await server.emit(
        "mainDebug", "Finished mainDebug event on server", to=sid
    )


@server.event
async def executeNext(sid: str) -> None:
    assert sid in user
    dbg = user[sid].dbg

    await dbg.next()
    info(f"[{sid}] run 'executeNext'")
    await server.emit(
        "executeNext", "Finished executeNext event on server-side", to=sid
    )

    legacy_types, legacy_mem = await dbg.legacy_trace()
    for kind in legacy_types:
        if kind["typeName"] in user[sid].seen:
            continue
        user[sid].seen.add(kind["typeName"])
        await server.emit(
            "sendTypeDeclaration",
            kind,
            to=sid,
        )
    await server.emit("sendBackendStateToUser", legacy_mem, to=sid)


@server.event
async def EOF(sid: str) -> None:
    error("event 'EOF' not implemented")


@server.event
async def SIGINT(sid: str) -> None:
    error("event 'SIGINT' not implemented")


@server.event
async def send_stdin(sid: str) -> None:
    error("event 'send_stdin' not implemented")


app = ASGIApp(server, socketio_path="/dapi")

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000

    info(" /\\_/\\ ")
    info("( ^.^ )")
    info(" > ^ < ")
    info(f"Server is available at [http://localhost:{port}/]")

    run("__main__:app", port=port, host=host, log_level="error")
