import gdb
import re


def get_frame_info():
    gdb_frame_data: str = gdb.execute("bt", to_string=True)
    gdb_frame_data: str = gdb_frame_data.split("\n", 1)[0]

    frame_info: dict = {}
    split_data = gdb_frame_data.strip().split(") at", 1)

    frame_info["line_num"] = int(re.search(r"[0-9]+$", split_data[1]).group(0))

    file_name = split_data[1].strip().rstrip("0123456789")[:-1]
    frame_info["file"] = file_name
    frame_info["function"] = split_data[0].replace(
        "#0", "").strip().split(" ")[0]

    # Extract the actual line of code
    line = gdb.execute("frame", to_string=True)
    line = line.split("\n")[1].strip()

    if m := re.fullmatch(r"^[0-9]+\t(.*)$", line):
        frame_info["line"] = m.group(1)
    else:
        frame_info["line"] = ""

    return frame_info


def get_stack_data():
    locals: str = gdb.execute("info locals", to_string=True)
    args: str = gdb.execute("info args", to_string=True)

    variable_list: list[str] = []

    if locals.strip() != "No locals.":
        variable_list += locals.strip().split("\n")

    if args.strip() != "No arguments.":
        variable_list += args.strip().split("\n")

    variables: list[dict] = []
    for var in variable_list:
        variable: dict = {}
        temp = var.split(" = ", 1)
        variable["name"] = temp[0]
        variable["value"] = temp[1]
        type: str = gdb.execute(f"ptype {variable['name']}", to_string=True)
        variable["type"] = type.strip().split(" = ", 1)[1]
        variables.append(variable)

    return variables

# Use this for testing
# if __name__ == "__main__":
#     print(get_stack_data())
#     print(get_frame_info())
