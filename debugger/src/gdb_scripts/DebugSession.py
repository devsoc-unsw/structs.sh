import gdb
import datetime

from src.gdb_scripts.Publisher import Publisher
from src.gdb_scripts.custom_next import CustomNextCommand
from src.gdb_scripts.parse_functions import (
    get_type_decl_strs,
    pycparser_parse_type_decls,
    pycparser_parse_fn_decls,
)
from src.gdb_scripts.iomanager import IOManager
from src.constants import CUSTOM_NEXT_COMMAND_NAME

class DebugSession:
    def __init__(self, user_socket_id: str, ipc_port: int, program_name: str):
        print("Initializing DebugSession instance...")

        self.user_socket_id = user_socket_id
        print(f"FE client socket io: {self.user_socket_id}")

        gdb.execute("set python print-stack full")
        gdb.execute("set pagination off")

        # Load program to debug. Make sure it is compiled with -g flag to
        # include debug symbols
        # from_tty=True option makes the output of this command show up in
        # the gdb's paginated output stream. Equivalent to:
        # output = gdb.execute(cmd, to_string=True)
        # gdb.write(output)
        gdb.execute(f"file {program_name}", from_tty=True)
        gdb.flush()

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

        self.custom_next_command = CustomNextCommand(
            CUSTOM_NEXT_COMMAND_NAME, self.user_socket_id, self
        )

        self.io_manager = IOManager(user_socket_id=self.user_socket_id)

        # Restrict the publisher socket to only listen for subscribers
        # connections coming from the loopback network interface (localhost).
        # Bc the debugger server running the subscriber threads should be
        # running on the same machine as this publisher.
        host = '127.0.0.1'
        print(f"begin create publisher at datetime {datetime.datetime.now()}")
        self.publisher = Publisher.create_publisher(host, ipc_port)
        print(f"created publisher at datetime {datetime.datetime.now()}")
        gdb.flush()

        # Start the debug session
        gdb.execute("start", from_tty=True)

        # Make stdout stream unbuffered
        gdb.execute("call setbuf(stdout, (void *) 0)", from_tty=True)

    def get_cached_type_decl_strs(self):
        return self.type_decl_strs

    def get_cached_parsed_type_decls(self):
        return self.parsed_type_decls

    def get_cached_parsed_fn_decls(self):
        return self.parsed_fn_decls

print(f"Sourced DebugSession.py")