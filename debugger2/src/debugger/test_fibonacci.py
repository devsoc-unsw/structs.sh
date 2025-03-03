from pathlib import Path

from debugger import Debugger, compile, Frame

here = Path(__file__).parent


async def test_fibonacci():
    source = here / "test_fibonacci.c"
    exe = here / "exe"
    assert source.exists()
    await compile(source, exe)

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
        assert await debug.frames() == [Frame("main", str(source), 16)]
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

        frames, memory, _ = await debug.trace()
        assert len(frames) == 2
        assert len(memory) == 6

        fibonacci = frames[0]
        assert len(fibonacci.vars) == 5
        assert fibonacci.vars["i"].type == "int"
        assert fibonacci.vars["i"].value == 1
        assert fibonacci.vars["n"].type == "int"
        assert fibonacci.vars["n"].value == 10
        assert fibonacci.vars["a"].type == "int"
        assert fibonacci.vars["a"].value == 0
        assert fibonacci.vars["b"].type == "int"
        assert fibonacci.vars["b"].value == 1
        assert fibonacci.vars["next"].type == "int"
        assert fibonacci.vars["next"].value == 0xBEEF

        main = frames[1]
        assert len(main.vars) == 1
        assert main.vars["n"].type == "int"

        assert memory[fibonacci.vars["i"].addr, "int"].value == 1
        assert memory[fibonacci.vars["n"].addr, "int"].value == 10
        assert memory[fibonacci.vars["a"].addr, "int"].value == 0
        assert memory[fibonacci.vars["b"].addr, "int"].value == 1
        assert memory[fibonacci.vars["next"].addr, "int"].value == 0xBEEF
        assert memory[main.vars["n"].addr, "int"].value == 10

        await debug.finish()

    finally:
        await debug.deinit()
        exe.unlink()

    assert (
        "".join(inferior_output)
        == "Fibonacci sequence up to 10 terms:\r\n0 1 1 2 3 5 8 13 21 34 \r\n"
    )
