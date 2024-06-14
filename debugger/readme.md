# Code Debugger
The backend part of visualize-debugger. The project that transfer user's C program into interactive visualization. 

A web server for compiling C programs and starting a GDB instance to inspect the state of data structures such as linked lists, arrays, trees and graphs.

## File Structure

```
.
├── .dockerignore
├── .gitignore
├── Dockerfile.dev
├── README.md
├── requirements.txt
└── src
    ├── gdb_scripts
    ├── placeholder_data.py
    ├── samples
    │   ├── Makefile
    │   ├── ...
    └── server.py
```

The top level (*/debugger*) mainly contains configurations for the Docker image (*Dockerfile.dev*, *.dockerignore*), git (*.gitignore*), and python dependencies (*requirements.txt*).

The */debugger/src* directory has all the debugger server logic. It is mounted onto the
Docker container's */app/src* volume which means if you edit files in the
*/debugger/src* directory, changes will immediately be reflected in the Docker
container. This setting is in */docker-compose.yml* under Volumes.

## Dependencies

- GDB and it's builtin python interpretter
- SocketIO (PyPI python-socketio)
- See requirements.txt for Python3 dependencies

# Development

1. `cd` into the `debugger` directory
2. Run `pip3 install -r requirements.txt` to install python dependencies.
3. `cd` into the `debugger/src` directory
4. Run `python3 server.py` to start the debugger server. Or `nodemon --exec python3 server.py`

# Running Docker image

To run the app with Docker, (both the client and server simultaneously) see the instructs in the [README.md](/README.md) in the project root directory.

# Running interactive shell in Docker image

To run an interactive bash shell to inspect the Ubuntu docker image for the debugger,
run the following command in your shell after starting the docker container
(to start docker the container see [](/readme.md)):

```bash
$ docker exec -it structssh-debugger-1 bash
```

The `structssh-debugger-1` above refers to the image name, which you can see by running the command:

```bash
$ docker images
```

## Notes

- The debugger/src/gdb_scripts directory only contains python files that should be run within a gdb instance, for example like this:
  - ```
    (gdb) source file_name.py
  ```
  - The `import` statements in these python files don't have any practical implication because all python scripts sourced within a gdb instance share the same namespace (it's like running lines from all files in a single interpretter). These `import` statements are just to satisfy the code editor's intellisense.

## Resources

- [GDB Sourceware documentation](https://sourceware.org/gdb/download/onlinedocs/gdb/index.html#Top)
- [GDB useful commands for this project (notion)](https://www.notion.so/structs/GDB-research-e142316cf7854b35a4c096a912398655?pvs=4)
- [Code Debugger main project page (notion)](https://www.notion.so/structs/Code-Debugger-844a3f9d39ac42bb8782038fcd13f7ad?pvs=4)
