import gdb


def get_frame_info():
    gdb_frame_data: str = gdb.execute("bt", to_string=True)
    gdb_frame_data = gdb_frame_data.split("\n", 1)[0]

    frame_info: dict = {}
    data1 = gdb_frame_data.split(") at", 1)

    file_name = data1[1].strip().rstrip("0123456789")[:-1]
    frame_info["file"] = file_name
    frame_info["function"] = data1[0].replace("#0", "").strip().split(" ")[0]

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


