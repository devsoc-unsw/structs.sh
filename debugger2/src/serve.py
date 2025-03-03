from dataclasses import asdict
import json
from pprint import pp
from tempfile import mkstemp
from pathlib import Path
import logging
import os

from uvicorn import run
from socketio import AsyncServer
from socketio import ASGIApp

from debugger import Debugger, compile

logging.basicConfig(level=logging.INFO)
debug = logging.debug
info = logging.info
warning = logging.warning
error = logging.error
exception = logging.exception
critical = logging.critical


server = AsyncServer(async_mode="asgi", cors_allowed_origins="*")


class State:
    async def init(self, code: str):
        fd, path = mkstemp(suffix=".c")
        os.close(fd)
        self.source = Path(path)

        fd, path = mkstemp()
        os.close(fd)
        self.exe = Path(path)

        self.debugger = Debugger()

        self.source.write_text(code)
        await compile(self.source, self.exe)
        await self.debugger.init(self.exe)

        self.seen = set()
        return self

    async def deinit(self):
        await self.debugger.deinit()
        self.exe.unlink()
        self.source.unlink()


state = dict[str, State]()


@server.event
async def connect(sid: str, environ: dict) -> None:
    info(f"[{sid}] connected")


@server.event
async def disconnect(sid: str) -> None:
    if sid in state:
        await state[sid].deinit()
        del state[sid]

    info(f"[{sid}] disconnected")


@server.event
async def echo(sid: str, data: any) -> None:
    info(f"[{sid}] received message '{data}', echoing back to client")
    await server.emit("echo", data=data, to=sid)


@server.event
async def mainDebug(sid: str, code: str) -> None:
    if sid in state:
        await state[sid].deinit()
        del state[sid]

    try:
        state[sid] = State()
        await state[sid].init(code)
    except AssertionError as e:
        info(f"[{sid}] failed to compile code")
        await server.emit("compileError", e.args[0][1].decode(), to=sid)
        return

    for func in await state[sid].debugger.functions():
        await state[sid].debugger.breakpoint(func)
    await state[sid].debugger.run()

    info(f"[{sid}] compiled code")
    await server.emit(
        "mainDebug", "Finished mainDebug event on server", to=sid
    )


@server.event
async def executeNext(sid: str) -> None:
    assert sid in state
    debugger = state[sid].debugger

    await debugger.next()
    info(f"[{sid}] run 'executeNext'")
    await server.emit(
        "executeNext", "Finished executeNext event on server-side", to=sid
    )

    legacy_types, legacy_mem = await debugger.legacy_trace()
    for type in legacy_types:
        if type["typeName"] in state[sid].seen:
            continue
        state[sid].seen.add(type["typeName"])
        await server.emit(
            "sendTypeDeclaration",
            json.loads(json.dumps(type, default=asdict)),
            to=sid,
        )
    await server.emit(
        "sendBackendStateToUser",
        json.loads(json.dumps(legacy_mem, default=asdict)),
        to=sid,
    )


@server.event
async def EOF(sid: str) -> None:
    error("event 'EOF' not implemented")


@server.event
async def SIGINT(sid: str) -> None:
    error("event 'SIGINT' not implemented")


@server.event
async def send_stdin(sid: str) -> None:
    error("event 'send_stdin' not implemented")


app = ASGIApp(server, socketio_path="/debugger")

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000

    info(" /\\_/\\ ")
    info("( ^.^ )")
    info(" > ^ < ")
    info(f"Server is available at [http://localhost:{port}/]")

    run("__main__:app", port=port, host=host, log_level="error")
