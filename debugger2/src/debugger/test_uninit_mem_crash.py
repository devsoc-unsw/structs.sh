from pathlib import Path
from pprint import pp

from debugger import Debugger, compile

here = Path(__file__).parent


async def test_uninit_mem_crash():
    source = here / "test_uninitialized.c"
    exe = here / "test_uninitialized"
    await compile(source, exe)

    try:
        debug = Debugger()
        await debug.init(exe)
        await debug.breakpoint("main")
        await debug.run()

        for _ in range(5):
            await debug.next()

        await debug.trace()
        # pp(await debug.trace())
    finally:
        await debug.deinit()
        exe.unlink()
