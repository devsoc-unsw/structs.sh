import fcntl
import os
import select
import subprocess
import time
from typing import IO


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
