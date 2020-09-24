### Temporary 'Daemon' Server Process:
1. Run `nohup sh terminal-serve.sh` to keep the shell script running in the background without being attached to any terminal instance.
2. To kill the process, `ps -ef | grep 'terminal'` and pass the related PIDs to `kill -9 <pids>`

Eventually, the server should be run as a service.
