# Code Debugger

A web server for compiling C programs and starting a GDB instance to inspect the state of data structures such as linked lists, arrays, trees and graphs.

## Dependencies

- GDB and it's builtin python interpretter
- SocketIO (PyPI python-socketio)
- See requirements.txt for Python3 dependencies

# Development

1. `cd` into the `debugger` directory
1. Run `pip3 install -r requirements.txt` to install python dependencies.
1. Run `python3 server.py` to start the debugger server.

# Running Docker image

To run the app with Docker, (both the client and server simultaneously) see the instructs in the [README.md](/README.md) in the project root directory.

# Running interactive shell in Docker image

To run an interactive bash shell to inspect the Ubuntu docker image for the debugger,
run the following command in your shell after starting the docker image:

```bash
$ docker exec -it structssh-debugger-1 bash
```


## Resources

- [GDB Sourceware documentation](https://sourceware.org/gdb/download/onlinedocs/gdb/index.html#Top)
- [GDB useful commands for this project (notion)](https://www.notion.so/structs/GDB-research-e142316cf7854b35a4c096a912398655?pvs=4)
- [Code Debugger main project page (notion)](https://www.notion.so/structs/Code-Debugger-844a3f9d39ac42bb8782038fcd13f7ad?pvs=4)
