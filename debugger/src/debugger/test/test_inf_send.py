from asyncio import sleep
from tools import compile_run


async def test_circular():
    async with compile_run(__file__) as (db, _, inf):
        await db.run()
        await db.next()
        await db.inf_send("41414\n")
        await db.cont()

    assert "".join(inf) == "hello, 41414!\r\n"
