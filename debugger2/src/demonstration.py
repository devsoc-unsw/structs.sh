from asyncio import CancelledError, run
from pathlib import Path
from pprint import pp

from debugger import Debugger, compile

here = Path(__file__).parent


async def main():
    source = here / "demonstration_fib.c"
    exe = here / "fib"
    await compile(source, exe)

    try:
        debug = Debugger()

        @debug.on_oob
        def print_gray(message: any) -> None:
            print("\x1b[38;5;236m", end="")
            pp(message)
            print("\x1b[0m", end="")

        @debug.on_inferior
        def print_blue(message: any) -> None:
            print("\x1b[38;5;17m", end="")
            pp(message)
            print("\x1b[0m", end="")

        await debug.init(exe)

        functions = await debug.functions()
        print(f"found functions: {functions}")
        for function in functions:
            await debug.breakpoint(function)

        # --- experimental
        res = await debug.run_command("-symbol-info-types")
        custom_types = [
            sym["name"]
            for file in res["symbols"]["debug"]
            for sym in file["symbols"]
            if "line" in sym
        ]
        for type in custom_types:
            try:
                pp(await debug.console(f"ptype struct {type}"))
            except ValueError:
                continue
        # ---

        await debug.run()
        print(await debug.frames())
        print(await debug.variables())
        print(await debug.var_details("n"))
        pp(await debug.trace())
        await debug.cont()
        await debug.cont()

    except CancelledError:
        pass
    finally:
        await debug.deinit()
        exe.unlink()


if __name__ == "__main__":
    run(main())
