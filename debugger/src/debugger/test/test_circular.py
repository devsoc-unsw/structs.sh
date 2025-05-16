from tools import compile_run


async def test_circular():
    async with compile_run(__file__) as (db, _, _):
        await db.run()
        await db.next()
        await db.next()
        await db.next()
        await db.next()

        await db.trace()
