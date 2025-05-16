from asyncio import CancelledError, run
from pathlib import Path
from pprint import pp

from debugger import Debugger, c_compile, mi

here = Path(__file__).parent


async def main():
    source = here / "demo_fib.c"
    exe = here / "fib"
    await c_compile(source, exe)

    try:
        debug = Debugger()

        @debug.on_exec_async
        def print_gray(ea: mi.ExecAsync) -> None:
            if (
                ea.kind == "stopped"
                and ea.output["reason"] == "breakpoint-hit"
            ):
                print("\x1b[38;5;236m", end="")
                pp(ea.output)
                print("\x1b[0m", end="")

        @debug.on_inf
        def print_blue(msg: str) -> None:
            print("\x1b[38;5;17m", end="")
            pp(msg)
            print("\x1b[0m", end="")

        await debug.init(exe)

        functions = await debug.functions()
        for function in functions:
            await debug.breakpoint(function)

        await debug.run()
        await debug.next()
        await debug.next()
        await debug.next()
        await debug.next()
        await debug.next()
        await debug.next()

        re = await debug.trace()
        pp(re.model_dump())

        print("console: " + repr(await debug.console("ptype 2")))
        print("console: " + repr(await debug.console("echo hiiii")))

        # await debug.cont()
        await debug.finish()

    except CancelledError:
        pass
    finally:
        await debug.deinit()
        exe.unlink()


if __name__ == "__main__":
    run(main())
