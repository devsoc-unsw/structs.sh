from pprint import pp
from debugger.test.tools import compile_run


async def test_circular():
    async with compile_run(__file__) as (db, _, _):
        await db.run()
        await db.next()
        await db.next()
        await db.next()
        await db.next()

        # trace = await db.trace()
        # pp(trace.frames)
        # pp(trace.mem)
