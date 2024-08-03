'''
Tools for interprocess communication between the main debugger server
and the gdb subprocesses that it has spawned.

Event-based, modelled on publisher-subscriber model so that:
- messages being received from another process are detected instantaneously
- no explicit polling or busy waiting; we use threads for publisher to accept
    subscribers and for subscribers to listen to publisher

Closely related to the Subscriber in this module is the Publisher in
debugger/gdb_scripts/Publisher.py
The Publisher implementation is placed there instead of here because it is
technically a gdb script which, like all other gdb scripts, runs inside
gdb subprocesses. It just happens to be written in python, but it is not
the same python runtime as this program and other python programs initiated
from server.py.
'''

import socket
import threading

from utils.socket_utils import connect_and_retry

# If this module is imported into some other file using `from ipc import *` then the list `__all__`
# defines all the things included in the import. So `connect_and_retry` won't be
# imported.
__all__ = ["Subscriber"]

class Subscriber:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.thread = threading.Thread(target=self.listen)

    @staticmethod
    def create_subscriber(host: str, port: int):
        return Subscriber(host, port)

    # def start(self, publisher_ready_event):
    #     timeout = 5
    #     result = publisher_ready_event.wait(timeout)
    #     if result:
    #         print(f"publisher triggered ready event, subscriber start thread")
    #         self.thread.start()
    #     else:
    #         raise RuntimeError(f"Event timeout: publisher_ready_event was not set to true after {timeout} seconds.")

    # def start(self, child_conn: multiprocessing.connection.Connection):
    #     timeout = 10
    #     if child_conn.poll(timeout):
    #         message = child_conn.recv()
    #         if message == "publisher ready":
    #             self.thread.start()
    #         else:
    #             raise RuntimeError("Publisher reported not ready.")
    #     else:
    #         # raise RuntimeError(f"Timeout: publisher did not respond after {timeout} seconds.")
    #         print(f"Timeout: publisher did not respond after {timeout} seconds.")

    def start(self):
        self.thread.start()

    def listen(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            connect_and_retry(sock, (self.host, self.port), [1,2,4])
                
            print(f"Subscriber with socket {sock.getsockname()} listening to socket {sock.getpeername()}")

            while True:
                data = sock.recv(4096)
                if not data or data.decode().lower() == "please unsubscribe":
                    print(f"Subscriber stop listening to socket {sock.getsockname()}.")
                    break
                print('Subscriber received', repr(data.decode()))
