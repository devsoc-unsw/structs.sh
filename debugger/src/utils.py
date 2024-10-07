import fcntl
import os
import select
import subprocess
import time
from typing import IO

from src.constants import (
    CUSTOM_NEXT_COMMAND_NAME,
    CUSTOM_NEXT_SCRIPT_NAME,
    DEBUG_SESSION_VAR_NAME,
)


def make_non_blocking(file_obj: IO) -> None:
    """
    Make a file object non-blocking so the program is not blocked when reading from
    or writing to this file object.
    """
    fcntl.fcntl(file_obj, fcntl.F_SETFL, os.O_NONBLOCK)


def get_subprocess_output(proc: subprocess.Popen, timeout_duration: int):
    """
    Get stdout of subprocesss running a gdb instance.
    """
    timeout_time_sec = time.time() + timeout_duration

    while True:
        select_timeout_dur = timeout_time_sec - time.time()
        if select_timeout_dur < 0:
            select_timeout_dur = 0

        filenos = [proc.stdout.fileno()]
        if proc.stderr:
            filenos.append(proc.stderr.fileno())
        events, _, _ = select.select(filenos, [], [], select_timeout_dur)

        for fileno in events:
            if fileno == proc.stdout.fileno():
                print(
                    f"VVVVVVVVVV Read from gdb subprocess stdout fileno = {fileno}:")
                proc.stdout.flush()
                raw_output = proc.stdout.read()
                print(raw_output, end="\n^^^^^^^^^^ End read stdout\n\n")
            elif proc.stderr and fileno == proc.stderr.fileno():
                print(
                    f"VVVVVVVVVV Read from gdb subprocess stderr fileno = {fileno}:")
                proc.stderr.flush()
                raw_output = proc.stderr.read()
                print(raw_output, end="\n^^^^^^^^^^ End read stderr\n\n")

        if timeout_duration == 0:
            break

        elif time.time() >= timeout_time_sec:
            print("Read from proc.stdout timed out. Exiting read loop.")
            break


def get_gdb_script(
    program_name: str, abs_file_path: str, socket_id: str, script_name: str = "default"
):
    GDB_SCRIPTS = {
        "default": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{program_name}")
        """,
        # Example:
        # source /app/src/gdb_scripts/DebugSession.py
        # python debug_session = DebugSession("78fdAsD32", "main")

        "default_manual_start": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{program_name}")
        python {DEBUG_SESSION_VAR_NAME}.type_decl_strs = get_type_decl_strs()
        python {DEBUG_SESSION_VAR_NAME}.parsed_type_decls = pycparser_parse_type_decls({DEBUG_SESSION_VAR_NAME}.user_socket_id)
        python {DEBUG_SESSION_VAR_NAME}.parsed_fn_decls = pycparser_parse_fn_decls({DEBUG_SESSION_VAR_NAME}.user_socket_id)
        python {DEBUG_SESSION_VAR_NAME}.custom_next_command = CustomNextCommand(CUSTOM_NEXT_COMMAND_NAME, {DEBUG_SESSION_VAR_NAME}.user_socket_id, {DEBUG_SESSION_VAR_NAME})
        python {DEBUG_SESSION_VAR_NAME}.io_manager = IOManager(user_socket_id=python {DEBUG_SESSION_VAR_NAME}.user_socket_id)
        start
        call setbuf(stdout, NULL)
        """,

        "default_legacy": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/parse_functions.py
        python pycparser_parse_fn_decls("{socket_id}")
        python pycparser_parse_type_decls("{socket_id}")
        source {abs_file_path}/gdb_scripts/{CUSTOM_NEXT_SCRIPT_NAME}
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        python io_manager = IOManager(user_socket_id="{socket_id}")
        start
        """,

        "test_declarations_parser": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/parse_functions.py
        python pycparser_parse_fn_decls("{socket_id}")
        start""",
        "test_custom_next": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/{CUSTOM_NEXT_SCRIPT_NAME}
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        start
        next
        step
        step
        """,

        "test_io": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/test_io")
        source {abs_file_path}/gdb_scripts/test_io.py
        """,

        "test_io_legacy": f"""
        set python print-stack full
        set pagination off
        file {abs_file_path}/samples/test_io
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/{CUSTOM_NEXT_SCRIPT_NAME}
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        source {abs_file_path}/gdb_scripts/test_io.py
        start
        """,

        "test_stdout": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/stdout")
        """,

        "test_linked_list_1": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/linkedlist/main1")
        """,

        "test_linked_list_2": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/linkedlist/main2")
        """,

        "test_linked_list_3": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/linkedlist/main3")
        """,

        "test_linked_list_4": f"""
        source {abs_file_path}/gdb_scripts/DebugSession.py
        python {DEBUG_SESSION_VAR_NAME} = DebugSession("{socket_id}", "{abs_file_path}/samples/linkedlist/main4")
        """,

        "test_linked_list": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/parse_functions.py
        python pycparser_parse_fn_decls("{socket_id}")
        python pycparser_parse_type_decls("{socket_id}")
        source {abs_file_path}/gdb_scripts/{CUSTOM_NEXT_SCRIPT_NAME}
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        python io_manager = IOManager(user_socket_id="{socket_id}")
        start
        """,
    }

    if script_name not in GDB_SCRIPTS:
        print(f"\n\nWARNING: script named {script_name} not found in GDB_SCRIPTS dictionary, defaulting to the 'default' script.")
        script_name = "default"

    return GDB_SCRIPTS[script_name]


def create_abs_file_path(file_name: str):
    return os.path.dirname(os.path.abspath(__file__)) + "/" + file_name


def create_ll_script(abs_file_path, line_numbers, program_name):
    gdb_script = (
        f"""
source {abs_file_path}/gdb_scripts/traverse_linked_list.py
python NodeListCommand("nodelist", "l")

file {program_name}
"""
        + "\n".join([f"break {n}" for n in line_numbers])
        + f"""
run
nodelist
continue
quit
"""
    )
    return gdb_script


def create_ll_script_2(abs_file_path, program_name):
    gdb_script = f"""
source {abs_file_path}/gdb_scripts/{CUSTOM_NEXT_SCRIPT_NAME}
# python info_functions_output = gdb.execute("info functions -n", False, True)
# python my_functions = parseFunctionNames(info_functions_output)
# python breakOnUserFunctions(my_functions)

python StepCommand("custom_next", my_functions)

file {program_name}
start
python newHeapDict = myNext()
python print(newHeapDict)
"""
    return gdb_script
