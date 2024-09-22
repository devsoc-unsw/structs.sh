'''
Unix socket related utilities. Originally made for ipc module.
'''

# Determines what port is lended to a debugging session for Unix socket
# communications between the server and gdb subprocess.
# Increments from MIN_SOCKET_PORT to MAX_SOCKET_PORT.
from contextlib import closing
import socket
import time
from src.constants import MIN_SOCKET_PORT, PORT_RANGE


curr_socket_port_offset = MIN_SOCKET_PORT

def find_new_port():
    for _ in range(PORT_RANGE):
        curr_socket_port = MIN_SOCKET_PORT + (find_new_port.curr_socket_port_offset%PORT_RANGE)
        find_new_port.curr_socket_port_offset += 1
        if check_port_valid_and_available(curr_socket_port):
            return curr_socket_port
    raise RuntimeError("Could not find valid and available port")

# Determines what port is lended to a debugging session for Unix socket
# communications between the server and gdb subprocess.
# Increments from MIN_SOCKET_PORT to MAX_SOCKET_PORT.
find_new_port.curr_socket_port_offset = MIN_SOCKET_PORT

def check_port_valid_and_available(port):
    '''
    Checks if the port is in range and is 'closed' ie available to be opened
    and used by a new socket.
    '''
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        # Timeout after 2 seconds if the port cannot be
        # connected, maybe because the port is not open.
        sock.settimeout(2)
        try:
            print(f'check port {port}')
            result = sock.connect_ex(("127.0.0.1", port))
            # `result` will be 0 if the port is "open" ie there is an
            # application or service actively listening for incoming connections
            # on that port.
            print(f'result {result}')
            return result != 0
        except socket.timeout:
            return False

# TODO: make non-blocking? but then if user runs custom_next command before
# connected, then they might miss some important stuff being delivered by
# the socket connection that this function asynchronously opens.
def connect_and_retry(sock: socket.socket, addr, retry_intervals: list[int]):
    '''
    Attempt to connect socket `sock` to address `addr` and retry at intervals
    specified in `retry_intervals` (in seconds) on ConnectionRefusedError.

    Example:
    `connect_and_retry(sock, ('127.0.0.1', 9426), [1, 3, 9])`
    Attempt to connect sock to (host, port) immediately.
    If ConnectionRefusedError then try again after waiting 1sec.
    Then again after waiting 3sec. etc.

    If still ConnectionRefusedError after all retries, then throws the
    ConnectionRefusedError.
    '''
    retry_intervals.insert(0, 0) # First try immediately
    for attempt_count in range(1, len(retry_intervals)+1):
        try:
            time.sleep(retry_intervals[attempt_count-1])
            sock.connect(addr)
            print(f'socket connection attempt succeeded on attempt {attempt_count}')
            break
        except ConnectionRefusedError as e:
            if attempt_count == len(retry_intervals):
                print(f"socket connection attempt to {addr} failed on attempt {attempt_count} (last).")
                raise e
            else:
                print(f"socket connection attempt to {addr} failed on attempt {attempt_count}. Will retry after {retry_intervals[attempt_count]} seconds ...")
                continue


