import socket
import urllib3
from urllib3.connection import HTTPConnection
import sys
import time
import requests
import socketio


def useSocketIOConnection(func):
    def wrapper(*args, **kwargs):
        # Increase socket buffer size to reduce chance of connection failure
        # due to insufficient buffer size.
        # https://stackoverflow.com/a/67732984/17815949
        HTTPConnection.default_socket_options = (
            HTTPConnection.default_socket_options + [
                (socket.SOL_SOCKET, socket.SO_SNDBUF, 1000000),  # 1MB in byte
                (socket.SOL_SOCKET, socket.SO_RCVBUF, 1000000)
            ])

        # Disable verifying server-side SSL certificate
        http_session = requests.Session()
        http_session.verify = False
        # sio = socketio.Client()
        sio = socketio.Client(http_session=http_session)

        # Try connect to server loop
        NUM_RETRIES = 2
        for i in range(NUM_RETRIES):
            try:
                sio.connect('http://localhost:8000', wait_timeout=20)
                print(
                    f"Parser client successfully established socket connection to server. Socket ID: {sio.sid}")
                break
            except Exception as ex:
                print(ex)
                print("Parser client failed to establish socket connection to server:",
                      type(ex).__name__)
                if i == NUM_RETRIES - 1:
                    print("Exiting parser client...")
                    sys.exit(1)
                else:
                    print("Retrying...")

        result = func(*args, **kwargs, sio=sio)

        sio.disconnect()
        return result

    return wrapper


def enable_socketio_client_emit():
    # I don't know why but apparently opening a file is NECESSARY for
    # the above sio.emit() call to work. Discovered from extensive debugging.
    # If you figure out how to get the above sio.emit() call to work without
    # this weird hack please let @dqna64 know.
    with open("random_useless_file_to_open.txt", "w") as f:
        f.write("hello world")
