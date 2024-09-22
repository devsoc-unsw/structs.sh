import gdb
import multiprocessing.connection
import multiprocessing
import socket
import threading
from typing import Any, Dict, Callable

DEBUG_PUBLISHER: bool = True

SUBSCRIPTION_THREAD_JOIN_TIMEOUT: int = 2

class Subscription:
    def __init__(self, addr, conn: socket.socket, remove_self: Callable[[], None]):
        self.conn = conn
        self.addr = addr
        self.thread = threading.Thread(target=self.__handle_subscription)
        self.thread.start()
        self.remove_self = remove_self
    
    def __handle_subscription(self):
        with self.conn:
            try:
                while True:
                    data = self.conn.recv(1024)
                    if not data:
                        DEBUG_PUBLISHER and print(f"None data received by subscriber {self.addr}, terminating subscription.")
                        break
            except Exception as e:
                print(f"Error with subscriber {self.addr} receiving data, terminating subscription")
                raise e

            ## `self.conn` will automatically close when execution leaves the
            # `with self.conn` block.
        self.remove_self(self.addr)

    @staticmethod
    def create_subscription(addr, conn: socket.socket):
        return Subscription(addr, conn)

    def request_unsubscribe(self):
        try:
            # Poitely ask the subscriber to unsubscribe
            self.conn.sendall(b"please unsubscribe")
        except Exception as e:
            print(f"Error sending to {self.conn.getpeername()}:")
            raise e

        DEBUG_PUBLISHER and print(f"Waiting for thread {self.thread.name} handling subscriber {self.addr} to finish...")
        self.thread.join(SUBSCRIPTION_THREAD_JOIN_TIMEOUT)
        if self.thread.is_alive():
            raise RuntimeError(f"Thread join timed out. Thread {self.thread.name}, timeout {SUBSCRIPTION_THREAD_JOIN_TIMEOUT}")
        else:
            DEBUG_PUBLISHER and print(f"Thread {self.thread.name} handling subscriber {self.addr} finished.")


class Publisher:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

        self.subscriptions: Dict[Any, Subscription] = dict()
        self.subscriptions_lock: threading.Lock = threading.Lock()

        self.publisher_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.publisher_socket.bind((self.host, self.port))
        ## Allow reusing the same port after Ctrl+C
        self.publisher_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.publisher_socket.listen()
        print(f"Publisher socket listening at {self.publisher_socket.getsockname()}. Waiting for subscribers...")
        gdb.flush()

        self.accept_subscriptions_thread = threading.Thread(target=self.__accept_subscriptions)
        self.stop_accepting_subscriptions: threading.Event = threading.Event()
        self.accept_subscriptions_thread.start()
        print(f"Publisher accepting connections at {self.host} {self.port}")
        
        # publisher_ready_event_fd = int(os.environ['PUBLISHER_READY_EVENT_FD'])
        # publisher_ready_event = multiprocessing.connection.Connection(publisher_ready_event_fd)
        # publisher_ready_event.set()

        # parent_conn_fd = int(os.environ['PARENT_CONN_FD'])
        # print(f"parent_conn_fd in subprocess: {parent_conn_fd}")
        # parent_conn = multiprocessing.connection.Connection(parent_conn_fd)
        # parent_conn.send("publisher ready")

        gdb.flush()

    @staticmethod
    def create_publisher(host: str, port: int):
        return Publisher(host, port)

    def __enter__(self):
        '''
        `.__enter__()` and `.__exit__()` are implemented for the context manager
        protocol, making this class a 'context manager object'. 
        
        ```
        with Publisher.create_publisher(HOST, PORT) as publisher:
            ## do stuff with publisher
            publisher.broadcast
        ```

        `.__enter__()` is called by the `with` statement to enter the runtime
        context.

        The return value of `.__enter__()` is put into the `as publisher`
        variable.
        '''
        return self

    def __exit__(self, exc_type, exc_value, exc_tb):
        '''
        `.__exit__()` is called when execution leaves the context of the `with`
        block.
        '''
        self.close()

    def __accept_subscriptions(self):
        '''
        Intended to be a private method (but Python doesn't have a concept of
        private method methods, so we use leading underscores __ to indicate
        that this should be used as a private method). Undergoes name mangling
        so you cannot use publisher.__accept_subscriptions() outside this class.
        https://docs.python.org/2/tutorial/classes.html#private-variables-and-class-local-references
        '''
        while not self.stop_accepting_subscriptions.is_set():
            try:
                # The purpose of this timeout is to perpetually go back to the
                # condition of the containing while loop, which makes sure
                # we are still accepting new subscriptions.
                # Note: This looks like polling for connections but its not
                # really. The `self.publisher_socket.accept()` does not work by
                # polling (at a high level), it waits.
                self.publisher_socket.settimeout(3)
                conn, addr = self.publisher_socket.accept()
                DEBUG_PUBLISHER and print(f"New subscriber connection to publisher accepted: {addr}")

                if not self.stop_accepting_subscriptions.is_set():
                    self.__add_subcription(
                        addr,
                        Subscription(
                            addr,
                            conn,
                            lambda addr: self.__remove_subscription(addr)
                        )
                    )
                else:
                    break
            except socket.timeout:
                continue
            except socket.error as e:
                if self.stop_accepting_subscriptions.is_set():
                    print(f'socket error raised while publisher no longer accepting connections:')
                    print(e)
                    break
                else:
                    raise e

        print(f'Terminate __accept_subscriptions')

    def __add_subcription(self, addr, subscription: Subscription):
        with self.subscriptions_lock:
            self.subscriptions[addr] = subscription
            DEBUG_PUBLISHER and print(f"Added subscription to socket {addr}")

    def __remove_subscription(self, addr):
        with self.subscriptions_lock:
            del self.subscriptions[addr]
            DEBUG_PUBLISHER and print(f"Removed subscription to socket {addr}")

    def broadcast(self, message: str):
        with self.subscriptions_lock:
            for subscription in self.subscriptions.values():
                try:
                    subscription.conn.sendall(message.encode())
                    print(f"Published to {subscription.conn.getpeername()}: {message}")
                except Exception as e:
                    print(f"Error sending to {subscription.conn.getpeername()}: {e}")

    def close(self):
        ## Trigger event to signal accept_subcriptions thread to stop accepting
        ## new subscriptions.
        self.stop_accepting_subscriptions.set()

        DEBUG_PUBLISHER and print(f"Waiting for thread {self.accept_subscriptions_thread.name} handling accepting new subscribers to finish...")
        self.accept_subscriptions_thread.join()
        DEBUG_PUBLISHER and print(f"Thread {self.accept_subscriptions_thread.name} handling accepting new subscribers has finished.")

        ## Ask all subscribers to unsubscribe.
        ## Does not guarantee that they will actually subscribe.
        ## But if they do then the thread handling that subscription should
        ## terminate and the subscription should remove itself from the
        ## publisher's list of subscriptions.
        for subscription in list(self.subscriptions.values()):
            subscription.request_unsubscribe()

        self.publisher_socket.close()
