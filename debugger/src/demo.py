from asyncio import CancelledError, run
import json
from pathlib import Path
from pprint import pp

from debugger import Debugger, c_compile, mion

here = Path(__file__).parent


async def main():
    source = here / "demo_fib.c"
    exe = here / "fib"
    await c_compile(source, exe)

    try:
        debug = Debugger()

        @debug.on_oob
        def print_gray(kind: str, subkind: str, msg: any) -> None:
            if kind != mion.EXEC_ASYNC:
                return
            if subkind != "stopped":
                return

            print("\x1b[38;5;236m", end="")
            pp(msg)
            print("\x1b[0m", end="")

        # @debug.on_inf
        # def print_blue(msg: str) -> None:
        #     print("\x1b[38;5;17m", end="")
        #     # pp(msg)
        #     print("\x1b[0m", end="")

        await debug.init(exe)

        functions = await debug.functions()
        for function in functions:
            await debug.breakpoint(function)

        await debug.run()
        await debug.cont()
        await debug.cont()

    except CancelledError:
        pass
    finally:
        await debug.deinit()
        exe.unlink()


if __name__ == "__main__":
    run(main())
