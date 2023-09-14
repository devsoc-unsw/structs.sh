import gdb

if __name__ == "__main__":
    pty = IOManager()
    outputs = []
    gdb.execute(f"tty {pty.name}")
    pty.write("1 2\n")
    pty.write("Hello\n")

    gdb.execute("b 19")
    gdb.execute("b 21")
    gdb.execute("b 23")
    gdb.execute("b 24")
    gdb.execute("run")
    outputs.append(pty.read())
    pty.write("foo foo\n")
    pty.write("a")

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    gdb.execute("c")
    outputs.append(pty.read())

    print(outputs)
