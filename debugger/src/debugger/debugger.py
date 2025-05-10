from __future__ import annotations

from collections import defaultdict, deque

from pydantic import BaseModel

from . import mion
from .base_debugger import BaseDebugger


class Identity[T](BaseModel):  # legacy
    item: T


class Trace(BaseModel):
    frames: list[FrameInfo]
    mem: dict[str, dict[str, MemObj]]

    # legacy
    structs: dict[str, list[tuple[str | int, str]]]


class Frame(BaseModel):
    func: str
    src: str
    line: int


class FrameInfo(BaseModel):
    frame: Frame
    vars: dict[str, MemObj]


Value = str | int | float | dict | list


class MemObj(BaseModel):
    kind: str
    value: Value
    addr: str | None


class Debugger(BaseDebugger):
    def __init__(self):
        super().__init__()
        self.var_ident = 0
        self.var_idents = set[int]()

    async def functions(self) -> list[str]:
        """Do not call while the inferior process is running"""

        res = await self.run_command("-symbol-info-functions")
        return [
            sym["name"]
            for file in res["symbols"]["debug"]
            for sym in file["symbols"]
        ]

    async def breakpoint(self, function: str) -> int:
        res = await self.run_command(f"-break-insert {function}")
        return int(res["bkpt"]["number"])

    async def run(self) -> None:
        await self.run_command("-exec-run")

    async def frames(self) -> list[Frame]:
        res = await self.run_command("-stack-list-frames")
        if "_start" == res["stack"][-1]["func"]:
            # `main`` has returned to `_start`/libc
            return []

        return [
            Frame(
                func=frame["func"], src=frame["file"], line=int(frame["line"])
            )
            for frame in res["stack"]
        ]

    async def next(self) -> None:
        await self.run_command("-exec-next")

    async def cont(self) -> None:
        await self.run_command("-exec-continue")

    async def finish(self) -> None:
        """Run the inferior process to completion"""
        await self.run_command("-exec-finish")

    async def variables(self, frame: int = 0) -> dict[str, str]:
        res = await self.run_command(
            f"-stack-list-variables --thread 1 --frame {frame} --all-values"
        )
        return {local["name"]: local["value"] for local in res["variables"]}

    async def var_details(
        self, var: str, frame: int = 0
    ) -> tuple[str, Value, str, list[tuple[str, str]]]:
        ident = self.var_ident
        self.var_ident = (1 + self.var_ident) % 256
        assert ident not in self.var_idents, (ident, self.var_idents)
        self.var_idents.add(ident)
        sid = f"id{ident}"

        try:
            await self.run_command(f"-stack-select-frame {frame}")

            await self.run_command(f"-var-create {sid} * {var}")
            res = await self.run_command(f"-var-info-type {sid}")
            kind = res["type"]

            res = await self.run_command(f"-var-list-children {sid}")
            childs = (
                [
                    (
                        int(ex) if (ex := ch["exp"]).isdigit() else ex,
                        ch["type"],
                    )
                    for ch in res["children"]
                ]
                if res["numchild"] != "0"
                else []
            )
            await self.run_command(f"-var-delete {sid}")

            res = await self.run_command(f"-data-evaluate-expression {var}")
            value = mion.parse_c_value(res["value"])

            res = await self.run_command(f"-data-evaluate-expression &{var}")
            address = res["value"].split(" ", 1)[0]

            return (kind, value, address, childs)
        finally:
            await self.run_command(f"-stack-select-frame 0")
            self.var_idents.remove(ident)

    async def trace(self):
        def follow(var: str, kind: str, childs: list[tuple[str | int, str]]):
            fmt_childs = list[str]()
            for subname, subkind in childs:
                if subkind == "char":
                    # It is a string
                    # Do not inspect every char
                    continue
                if type(subname) is int:
                    # It is an array index
                    fmt_childs.append(f"{var}[{subname}]")
                elif subname.startswith("*"):
                    # It is a pointer
                    fmt_childs.append(subname)
                elif kind.endswith("*"):
                    # It is a struct pointer
                    fmt_childs.append(f"(*{var})")
                else:
                    # It is a struct field
                    fmt_childs.append(f"({var}.{subname})")
            return fmt_childs

        frames = list[FrameInfo]()
        mem = defaultdict[str, dict[str, MemObj]](dict)
        legacy_fmt: dict[str, list[tuple[str | int, str]]] = {}  # legacy

        for i, frame in enumerate(await self.frames()):
            queue = deque()

            variabs = dict[str, MemObj]()
            for var in await self.variables(i):
                kind, value, addr, childs = await self.var_details(var, i)
                variabs[var] = MemObj(kind=kind, value=value, addr=addr)
                mem[addr][kind] = MemObj(kind=kind, value=value, addr=addr)
                if childs and not kind.endswith("*"):
                    legacy_fmt[kind] = childs
                if value != "0x0" and kind != "void *":
                    queue.extend(follow(var, kind, childs))
            frames.append(FrameInfo(frame=frame, vars=variabs))

            while queue:
                var = queue.popleft()
                try:
                    kind, value, addr, childs = await self.var_details(var, i)
                except ValueError:
                    continue
                if mem[addr].get(kind):
                    continue
                mem[addr][kind] = MemObj(kind=kind, value=value, addr=addr)
                if (
                    childs
                    and not kind.endswith("*")
                    and not kind.endswith("[]")
                ):
                    try:
                        legacy_fmt[kind] = childs
                        mem[addr][kind] = MemObj(
                            kind=kind,
                            value={
                                name: MemObj(
                                    kind=kind, value=value[name], addr=None
                                )
                                for name, kind in childs
                            },
                            addr=addr,
                        )  # legacy
                    except Exception:
                        assert False, (
                            [(name, kind) for name, kind in childs],
                            value,
                        )
                if value != "0x0" and kind != "void *":
                    queue.extend(follow(var, kind, childs))

        return Trace(frames=frames, mem=mem, structs=legacy_fmt)

    async def legacy_trace(self):
        frame = (await self.frames())[0]
        trace = await self.trace()

        legacy_types = [
            {
                "typeName": name,
                "fields": [
                    {"name": name, "typeName": kind} for name, kind in childs
                ],
            }
            for name, childs in trace.structs.items()
        ]

        legacy_mem = {
            "frame_info": {
                "file": frame.src,
                "function": frame.func,
                "line_num": frame.line,
            },
            "stack_data": {
                name: {"addr": o.addr, "typeName": o.kind, "value": o.value}
                for name, o in trace.frames[0].vars.items()
            },
            "heap_data": {
                addr: {"addr": addr, "typeName": o.kind, "value": o.value}
                for addr, subdict in reversed(trace.mem.items())
                for _, o in subdict.items()
                if "*" not in o.kind
                and "struct" in o.kind
                and not o.addr.startswith("0xffff")
            },
        }

        return legacy_types, Identity(item=legacy_mem).model_dump()["item"]
