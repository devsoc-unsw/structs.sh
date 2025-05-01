from pprint import pp
from tools import compile_run


async def test_uninit():
    async with compile_run(__file__) as (db, _, _):
        await db.run()
        trace = await db.trace()
        vars = trace.frames[0].vars
        assert vars["argc"].value == 1
        assert vars["argv"].value != "0x0"
        assert vars["uninitted_int"].value == 0
        assert vars["initted_int"].value == 0
        assert vars["uninitted_intp"].value == "0x0"
        assert vars["initted_intp"].value == "0x0"

        await db.next()
        await db.next()
        await db.next()
        trace = await db.trace()
        vars = trace.frames[0].vars
        assert vars["argc"].value == 1
        assert vars["argv"].value != "0x0"
        assert vars["uninitted_int"].value == 0
        assert vars["initted_int"].value == 2
        assert vars["uninitted_intp"].value == "0x0"
        assert vars["initted_intp"].value == "0x0"

        await db.next()
        await db.next()
        await db.next()
        await db.next()
        trace = await db.trace()
        assert vars["argc"].value == 1
        assert vars["argv"].value != "0x0"
        assert vars["uninitted_int"].value == 0
        assert vars["initted_int"].value == 2
        assert vars["uninitted_intp"].value == "0x0"
        assert vars["initted_intp"].value == vars["initted_int"].addr
