import gdb


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
if __name__ == "__main__":
    print(get_stack_data())


