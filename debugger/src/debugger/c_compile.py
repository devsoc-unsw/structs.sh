from asyncio import create_subprocess_exec
from asyncio.subprocess import PIPE


class CompileError(RuntimeError):
    def __init__(self, stderr: str):
        super().__init__(("Failed to compile code", stderr))
        self.stderr = stderr


async def c_compile(source_path: str, output_path: str) -> None:
    clang = await create_subprocess_exec(
        "gcc",
        str(source_path),
        "-o",
        str(output_path),
        "-ggdb",
        "-O0",
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
    )
    stdout, stderr = await clang.communicate()
    exit_code = await clang.wait()
    if exit_code:
        raise CompileError(stderr.decode())
