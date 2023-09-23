This is temporarily where the debugger server saves the user provided code.
Some notes:

- The directory is binded to the docker container. Any new files/directories created in the docker container will also appear in your host directory
- The debugger server currently doesn't clean up files at all. In the future, the files should be cleaned up after the debugging session ends
  The code is currently being stored here for ease of debugging. This is not ideal, it should be stored outside of a mounted directory (eg. in `/tmp`)
