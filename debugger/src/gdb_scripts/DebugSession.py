import gdb

from src.gdb_scripts.custom_next import CustomNextCommand
from src.gdb_scripts.parse_functions import (
    get_type_decl_strs,
    pycparser_parse_type_decls,
    pycparser_parse_fn_decls,
)
from src.gdb_scripts.iomanager import IOManager
from src.constants import CUSTOM_NEXT_COMMAND_NAME


class DebugSession:
    def __init__(self, user_socket_id: str, program_name: str):
        print("Initializing DebugSession instance...")

        self.user_socket_id = user_socket_id
        print(f"FE client socket io: {self.user_socket_id}")

        gdb.execute("set python print-stack full")
        gdb.execute("set pagination off")

        # Load program to debug. Make sure it is compiled with -g flag to
        # include debug symbols
        gdb.execute(f"file {program_name}")

        """
        Necessary to store these three information here because the output
        of the gdb instance for the command `info types` and `info functions -n`
        is messed up after starting the debug session. So store this before
        starting the debug session.
        """
        self.type_decl_strs = get_type_decl_strs()
        self.parsed_type_decls = pycparser_parse_type_decls(
            self.user_socket_id)
        self.parsed_fn_decls = pycparser_parse_fn_decls(self.user_socket_id)

        self.io_manager = IOManager(user_socket_id=self.user_socket_id)

        self.custom_next_command = CustomNextCommand(
            CUSTOM_NEXT_COMMAND_NAME,
            self.user_socket_id,
            self.io_manager,
            self.type_decl_strs,
            self.parsed_type_decls,
            self.parsed_fn_decls,
        )

        # Start the debug session
        gdb.execute("start")

        # Make stdout stream unbuffered
        gdb.execute("call setbuf(stdout, (void *) 0)")
