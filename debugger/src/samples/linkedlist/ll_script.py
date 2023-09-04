from pycparser import parse_file

# Input C code file and compiled output file
input_c_file = "malloc2.c"
compiled_output_file = "malloc2compiled"

with open(input_c_file, "r") as c_file:
    c_code = c_file.read()

with open("temp.c", "w") as temp_file:
    temp_file.write(c_code)

import subprocess
compile_command = f"gcc -E {temp_file.name} -o {compiled_output_file}"
subprocess.run(compile_command, shell=True)

ast = parse_file(compiled_output_file, use_cpp=False)

print("Abstract Syntax Tree (AST):")
print(ast)

import os
os.remove("temp.c")
