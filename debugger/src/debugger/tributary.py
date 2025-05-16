from asyncio import Queue, gather
from collections import defaultdict


class Tributary[T]:
    def __init__(self):
        self._chans = dict[int, Queue[T]]()
        self._id_pool = set[int]()

    def make_chan(self):
        if self._id_pool:
            id = self._id_pool.pop()
        else:
            id = len(self._chans)
            self._chans[id] = Queue()
        return id

    async def put(self, chan_id: int, item: T):
        assert chan_id in self._chans and chan_id not in self._id_pool
        await self._chans[chan_id].put(item)

    async def get(self, chan_id: int):
        assert chan_id in self._chans and chan_id not in self._id_pool
        item = await self._chans[chan_id].get()
        self._chans[chan_id].task_done()
        return item

    def close_chan(self, chan_id: int):
        assert chan_id in self._chans and chan_id not in self._id_pool
        assert self._chans[chan_id].empty()
        self._id_pool.add(chan_id)

    async def join(self):
        await gather(*[chan.join() for chan in self._chans.values()])
