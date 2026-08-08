import os

from .tools import compile_run


async def test_inf_eof():
    async with compile_run(__file__) as (db, _, inf):
        await db.run()
        await db.inf_send("\x04")
        await db.cont()

    assert "".join(inf) == "retval -1\r\n"
