import logging
from asyncio import gather
from logging import error, info

from aiofiles.os import unlink
from aiofiles.tempfile import NamedTemporaryFile as tempFile
from socketio import ASGIApp, AsyncServer
from uvicorn import run

from debugger import CompileError, Debugger, c_compile

logging.basicConfig(level=logging.INFO)
server = AsyncServer(async_mode="asgi", cors_allowed_origins="*")


class User:
    async def init(self, src_code: str):
        f = await tempFile(suffix=".c", delete=False)
        await f.write(src_code.encode())
        await f.close()
        self.src = f.name

        e = await tempFile(delete=False)
        await e.close()
        self.exe = e.name

        try:
            await c_compile(self.src, self.exe)
        except CompileError:
            await gather(unlink(self.src), unlink(self.exe))
            raise

        self.dbg = Debugger()
        await self.dbg.init(self.exe)

        self.seen = set()  # legacy

    async def deinit(self):
        await gather(self.dbg.deinit(), unlink(self.src), unlink(self.exe))


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

    dbg = user[sid].dbg

    @dbg.on_oob
    async def _(kind: str, subkind: str, msg: any):
        if subkind != "stopped":
            return

        match msg["reason"]:
            case "exited-normally":
                status = 0
            case "exited":
                status = msg["exit-code"]
            case _:
                return

        info(f"[{sid}] inferior exit({status})")
        await server.emit("__iexit__", f"{status}", to=sid)

    await gather(*[dbg.breakpoint(f) for f in await dbg.functions()])
    await dbg.run()

    info(f"[{sid}] compile code")
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

    if not await dbg.frames():
        await dbg.finish()
        return

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
async def send_inf(sid: str) -> None:
    error("event 'send_stdin' not implemented")


@server.event
async def send_inf_eof(sid: str) -> None:
    assert sid in user
    dbg = user[sid].dbg

    await dbg.inf_send("\x04")
    info(f"[{sid}] inf send EOF")


app = ASGIApp(server, socketio_path="/dapi")

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000

    info(r" /\_/\ ")
    info(r"( ^.^ )")
    info(r" > ^ < ")
    info(rf"Server is available at [http://localhost:{port}/]")

    run("__main__:app", port=port, host=host, log_level="error")

    info(r"See you again! (˵ •̀ ᴗ - ˵ ) ✧")
