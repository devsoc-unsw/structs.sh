### Daemon Start/Stop:
1. Run `nohup sh terminal-serve.sh` to keep the shell script running in the background without being attached to any terminal instance.
2. To kill the process, `kill -9 $(ps -ef | grep 'terminal-menu' | tr -s ' ' | cut -d ' ' -f 2)`

Eventually, the server should be run as a service.
