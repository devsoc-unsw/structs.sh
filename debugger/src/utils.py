import fcntl
import os
import select
import subprocess
import time
from typing import IO

from constants import CUSTOM_NEXT_COMMAND_NAME


def compile_program(file_names: list[str], user_program_name: str) -> None:
    '''
    Args:
        - file_names: list of file names to compile
        - user_program_name: name to call the compiled program
    '''
    subprocess.run(["gcc", "-ggdb", *file_names, "-o", user_program_name])


def make_non_blocking(file_obj: IO) -> None:
    '''
    Make a file object non-blocking so the program is not blocked when reading from
    or writing to this file object.
    '''
    fcntl.fcntl(file_obj, fcntl.F_SETFL, os.O_NONBLOCK)


def get_subprocess_output(proc: subprocess.Popen, timeout_duration: int):
    '''
    Get stdout of subprocesss running a gdb instance.
    '''
    timeout_time_sec = time.time() + timeout_duration

    while True:
        select_timeout_dur = timeout_time_sec - time.time()
        if select_timeout_dur < 0:
            select_timeout_dur = 0

        filenos = [proc.stdout.fileno()]
        if proc.stderr:
            filenos.append(proc.stderr.fileno())
        events, _, _ = select.select(
            filenos, [], [], select_timeout_dur)

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


def get_gdb_script(program_name: str, abs_file_path: str, socket_id: str, script_name: str = "default"):
    GDB_SCRIPTS = {
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
        source {abs_file_path}/gdb_scripts/linked_list_things.py
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        start
        next
        step
        step
        """,

        "test_io": f"""
        set python print-stack full
        set pagination off
        file {abs_file_path}/samples/test_io
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/linked_list_things.py
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        source {abs_file_path}/gdb_scripts/test_io.py
        start
        """,

        "test_stdout": f"""
        set python print-stack full
        set pagination off
        file {abs_file_path}/samples/stdout
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/linked_list_things.py
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        python io_manager = IOManager(user_socket_id="{socket_id}")
        start
        # skip the setbuf call
        next
        {CUSTOM_NEXT_COMMAND_NAME}
        python io_manager.read_and_send()
        {CUSTOM_NEXT_COMMAND_NAME}
        python io_manager.read_and_send()
        """,

        "test_linked_list": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/parse_functions.py
        python pycparser_parse_fn_decls("{socket_id}")
        python pycparser_parse_type_decls("{socket_id}")
        source {abs_file_path}/gdb_scripts/linked_list_things.py
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        python io_manager = IOManager(user_socket_id="{socket_id}")
        start
        """,

        "default": f"""
        set python print-stack full
        set pagination off
        file {program_name}
        python print("FE client socket io:", "{socket_id}")
        source {abs_file_path}/gdb_scripts/use_socketio_connection.py
        source {abs_file_path}/gdb_scripts/parse_functions.py
        python pycparser_parse_fn_decls("{socket_id}")
        python pycparser_parse_type_decls("{socket_id}")
        source {abs_file_path}/gdb_scripts/linked_list_things.py
        python CustomNextCommand("{CUSTOM_NEXT_COMMAND_NAME}", "{socket_id}")
        source {abs_file_path}/gdb_scripts/iomanager.py
        python io_manager = IOManager(user_socket_id="{socket_id}")
        start
        """
    }

    if script_name not in GDB_SCRIPTS:
        script_name = "default"
    return GDB_SCRIPTS[script_name]


def create_ll_script(abs_file_path, line_numbers, program_name):
    gdb_script = f"""
source {abs_file_path}/gdb_scripts/traverse_linked_list.py
python NodeListCommand("nodelist", "l")

file {program_name}
""" \
+ "\n".join([f"break {n}" for n in line_numbers]) \
        + f"""
run
nodelist
continue
quit
"""
    return gdb_script


def create_ll_script_2(abs_file_path, program_name):
    gdb_script = f"""
source {abs_file_path}/gdb_scripts/linked_list_things.py
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
