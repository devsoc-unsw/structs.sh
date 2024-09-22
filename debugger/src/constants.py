CUSTOM_NEXT_COMMAND_NAME = "custom_next"
CUSTOM_NEXT_SCRIPT_NAME = "custom_next.py"
DEBUG_SESSION_VAR_NAME = "debug_session"

# File to write the user-written malloc calls extracted from gdb
USER_MALLOC_CALL_FILE_NAME = "user_malloc_call.c"

# File to write the preprocessed C code to, before parsing with pycparser
USER_MALLOC_CALL_PREPROCESSED = "user_malloc_call_preprocessed"

# File to write ptype output
USER_PTYPE_FILE_NAME = "ptype_output.c"

# File to write preprocessed ptype output, befor parsing with pycparser
USER_PTYPE_PREPROCESSED = "ptype_output_preprocessed"

# Amount of time to allow select.select() to wait for program stdout before timing out
TIMEOUT_DURATION = 0.6

# Range of ports to give to debug sessions for communicating between debugger
# server and gdb subprocess.
# Ports used will be in range [MIN_SOCKET_PORT, MIN_SOCKET_PORT + PORT_RANGE)
MIN_SOCKET_PORT = 11000
PORT_RANGE = 100
