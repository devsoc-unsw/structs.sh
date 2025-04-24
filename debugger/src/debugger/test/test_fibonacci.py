from pathlib import Path

from debugger import Debugger, Frame, c_compile

here = Path(__file__).parent


async def test_fibonacci():
    source = here / "test_fibonacci.c"
    exe = here / "exe"
    assert source.exists()
    await c_compile(source, exe)

    debug = Debugger()

    inferior_output = list[str]()

    @debug.on_inferior
    def _(message: any) -> None:
        inferior_output.append(message)

    try:
        await debug.init(exe)
        assert await debug.functions() == ["fibonacci", "main"]

        await debug.breakpoint("main")
        await debug.breakpoint("fibonacci")
        await debug.run()
        assert await debug.frames() == [
            Frame(func="main", src=str(source), line=16)
        ]
        assert (await debug.variables()).keys() == {"n"}

        await debug.cont()
        assert [frame.func for frame in await debug.frames()] == [
            "fibonacci",
            "main",
        ]
        assert (await debug.variables()).keys() == {"n", "a", "b", "next"}

        await debug.next()
        await debug.next()
        await debug.next()
        assert (await debug.variables()).keys() == {"n", "a", "b", "next", "i"}

        trace = await debug.trace()
        assert len(trace.frames) == 2
        assert len(trace.mem) == 6

        fibonacci = trace.frames[0]
        assert len(fibonacci.vars) == 5
        assert fibonacci.vars["i"].kind == "int"
        assert fibonacci.vars["i"].value == 1
        assert fibonacci.vars["n"].kind == "int"
        assert fibonacci.vars["n"].value == 10
        assert fibonacci.vars["a"].kind == "int"
        assert fibonacci.vars["a"].value == 0
        assert fibonacci.vars["b"].kind == "int"
        assert fibonacci.vars["b"].value == 1
        assert fibonacci.vars["next"].kind == "int"
        assert fibonacci.vars["next"].value == 0xBEEF

        main = trace.frames[1]
        assert len(main.vars) == 1
        assert main.vars["n"].kind == "int"

        assert trace.mem[fibonacci.vars["i"].addr]["int"].value == 1
        assert trace.mem[fibonacci.vars["n"].addr]["int"].value == 10
        assert trace.mem[fibonacci.vars["a"].addr]["int"].value == 0
        assert trace.mem[fibonacci.vars["b"].addr]["int"].value == 1
        assert trace.mem[fibonacci.vars["next"].addr]["int"].value == 0xBEEF
        assert trace.mem[main.vars["n"].addr]["int"].value == 10

        await debug.finish()

    finally:
        await debug.deinit()
        exe.unlink()

    assert (
        "".join(inferior_output)
        == "Fibonacci sequence up to 10 terms:\r\n0 1 1 2 3 5 8 13 21 34 \r\n"
    )
