from __future__ import annotations
from collections import deque
from contextlib import suppress
from dataclasses import dataclass
from json import JSONDecodeError
from typing import TypedDict

from debugger import mion

from .base_debugger import BaseDebugger


@dataclass(slots=True, frozen=True)
class Frame:
    func: str
    file: str
    line: int


@dataclass(slots=True, frozen=True)
class FullFrame:
    frame: Frame
    vars: dict[str, Obj]


@dataclass(slots=True, frozen=True)
class Obj:
    type: str
    value: str | Obj
    addr: str | None


class Debugger(BaseDebugger):
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
        return [
            Frame(frame["func"], frame["file"], int(frame["line"]))
            for frame in res["stack"]
        ]

    async def next(self) -> None:
        await self.run_command("-exec-next")

    async def cont(self) -> None:
        await self.run_command("-exec-continue")

    async def finish(self) -> None:
        await self.run_command("-exec-finish")

    async def variables(self, frame: int = 0) -> dict[str, str]:
        res = await self.run_command(
            f"-stack-list-variables --thread 1 --frame {frame} --all-values"
        )
        return {local["name"]: local["value"] for local in res["variables"]}

    async def var_details(
        self, var: str, frame: int = 0
    ) -> tuple[str, str | dict, str, list[tuple[str, str]]]:
        await self.run_command(f"-stack-select-frame {frame}")

        await self.run_command(f"-var-create VARIABLE * {var}")
        res = await self.run_command(f"-var-info-type VARIABLE")
        type = res["type"]

        res = await self.run_command("-var-list-children VARIABLE")
        childs = (
            [(c["exp"], c["type"]) for c in res["children"]]
            if res["numchild"] != "0"
            else []
        )
        await self.run_command("-var-delete VARIABLE")

        res = await self.run_command(f"-data-evaluate-expression {var}")
        value = res["value"]
        with suppress(JSONDecodeError):
            value = mion.valueloads(res["value"])

        res = await self.run_command(f"-data-evaluate-expression &{var}")
        address = res["value"].split(" ", 1)[0]

        await self.run_command(f"-stack-select-frame 0")
        return (type, value, address, childs)

    async def trace(self):
        def follow(var: str, type: str, children: list[tuple[str, str]]):
            queue = list[str]()
            for subname, subtype in children:
                if subtype == "char":
                    # Avoid insepcting each char in each string
                    continue
                if subname.startswith("*"):
                    # It is a pointer
                    queue.append(subname)
                elif subname.isdigit():
                    # It is an array index
                    queue.append(f"{var}[{subname}]")
                elif type.endswith("*"):
                    # It is a struct pointer
                    queue.append(f"(*{var})")
                else:
                    # It is a struct field
                    queue.append(f"({var}.{subname})")
            return queue

        frames = list[FullFrame]()
        addresses: dict[tuple[str, str], Obj] = {}
        structs: dict[str, list[tuple[str, str]]] = {}  # legacy

        for i, frame in enumerate(await self.frames()):
            queue = deque()

            vars = dict[str, Obj]()
            for var in await self.variables(i):
                type, value, addr, childs = await self.var_details(var, i)
                vars[var] = Obj(type, value, addr)
                addresses[addr, type] = Obj(type, value, addr)
                if childs and not type.endswith("*"):
                    structs[type] = childs
                if value != "0x0" and type != "void *":
                    queue.extend(follow(var, type, childs))
            frames.append(FullFrame(frame, vars))

            while queue:
                var = queue.popleft()
                try:
                    type, value, addr, childs = await self.var_details(var, i)
                except ValueError:
                    continue
                if (addr, type) in addresses:
                    continue
                addresses[addr, type] = Obj(type, value, addr)
                if (
                    childs
                    and not type.endswith("*")
                    and not type.endswith("[]")
                ):
                    try:
                        structs[type] = childs
                        addresses[addr, type] = Obj(
                            type,
                            {
                                name: Obj(type, value[name], None)
                                for name, type in childs
                            },
                            addr,
                        )  # legacy
                    except Exception:
                        assert False, (
                            [(name, type) for name, type in childs],
                            value,
                        )
                if value != "0x0" and type != "void *":
                    queue.extend(follow(var, type, childs))

        return frames, addresses, structs

    async def legacy_trace(self):
        frame = (await self.frames())[0]
        frames, memory, types = await self.trace()

        legacy_types = [
            {
                "typeName": name,
                "fields": [
                    {"name": name, "typeName": type} for name, type in childs
                ],
            }
            for name, childs in types.items()
        ]

        legacy_mem = {
            "frame_info": {
                "file": frame.file,
                "function": frame.func,
                "line_num": frame.line,
            },
            "stack_data": {
                name: {"addr": o.addr, "typeName": o.type, "value": o.value}
                for name, o in frames[0].vars.items()
            },
            "heap_data": {
                addr: {"addr": addr, "typeName": o.type, "value": o.value}
                for (addr, _), o in reversed(memory.items())
                if "*" not in o.type
                and "struct" in o.type
                and not o.addr.startswith("0xffff")
            },
        }

        return legacy_types, legacy_mem
