from asyncio import gather
from contextlib import asynccontextmanager
from pathlib import Path

from debugger import c_compile
from debugger import mi_parser as mi
from debugger.debugger import Debugger


@asynccontextmanager
async def compile_run(file_dunder: str):
    testname = Path(file_dunder).stem
    d = Path(file_dunder).parent
    src = d / f"{testname}.c"
    exe = d / "__exe__"
    assert src.exists()
    await c_compile(src, exe)

    db = Debugger()
    oob = list[mi.ExecAsync | mi.NotifyAsync | mi.StatusAsync]()
    inf = list[str]()

    @db.on_inf
    def _(message: any):
        inf.append(message)

    @db.on_exec_async
    @db.on_notify_async
    @db.on_status_async
    def _(item: mi.ExecAsync | mi.NotifyAsync | mi.StatusAsync):
        oob.append(item)

    try:
        await db.init(exe)
        await gather(*[db.breakpoint(f) for f in await db.functions()])
        yield (db, oob, inf)
    finally:
        await db.deinit()
        exe.unlink()
