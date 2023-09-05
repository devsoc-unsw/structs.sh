# To use this compile the printing.c file
# Then run:
# gdb samples/printing --batch x printing.py
import importlib
import pty
import os
import select

m, s = pty.openpty()

print(os.ttyname(m))

outputs = []
gdb = importlib.import_module("gdb")

gdb.execute(f"tty {os.ttyname(s)}")
gdb.execute(f"show inferior-tty")
gdb.execute("b 14")
gdb.execute("b 19")
gdb.execute("b 25")
gdb.execute("b 28")

gdb.execute('run', to_string=True)
(data_to_read, _, _) = select.select([m], [], [], 0)
if data_to_read:
    temp = os.read(m, 1000)
    outputs.append(temp)

# temp = gdb.execute("info locals", to_string=True)
# outputs.append(temp)

gdb.execute('c', to_string=True)
(data_to_read, _, _) = select.select([m], [], [], 0)
if data_to_read:
    temp = os.read(m, 1000)
    outputs.append(temp)

# temp = gdb.execute("info locals", to_string=True)
# outputs.append(temp)

gdb.execute('c', to_string=True)
(data_to_read, _, _) = select.select([m], [], [], 0)
if data_to_read:
    temp = os.read(m, 1000)
    outputs.append(temp)

# temp = gdb.execute("info locals", to_string=True)
# outputs.append(temp)

gdb.execute('c', to_string=True)
(data_to_read, _, _) = select.select([m], [], [], 0)
if data_to_read:
    temp = os.read(m, 1000)
    outputs.append(temp)

# temp = gdb.execute("info locals", to_string=True)
# outputs.append(temp)

gdb.execute('c', to_string=True)
(data_to_read, _, _) = select.select([m], [], [], 0)
if data_to_read:
    temp = os.read(m, 1000)
    outputs.append(temp)

print(outputs)
