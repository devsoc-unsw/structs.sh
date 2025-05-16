from pathlib import Path

from debugger import Debugger, c_compile

here = Path(__file__).parent


async def test_uninit_mem_crash():
    source = here / "test_uninitialized.c"
    exe = here / "test_uninitialized"
    await c_compile(source, exe)

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
