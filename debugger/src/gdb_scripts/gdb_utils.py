def enable_socketio_client_emit():
    # I don't know why but apparently opening a file is NECESSARY for
    # the above sio.emit() call to work. Discovered from extensive debugging.
    # If you figure out how to get the above sio.emit() call to work without
    # this weird hack please let @dqna64 know.
    with open("random_useless_file_to_open.txt", "w") as f:
        f.write("hello world")
