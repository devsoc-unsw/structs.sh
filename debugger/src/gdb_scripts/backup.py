import gdb


class Lol:
    def __init__(self) -> None:
        self.heap_data = {}

    def lol(self):
        # === Up date existing tracked heap data
        # Make sure this is done AFTER executing the next command, so that the heap is actually updated
        for addr, obj in self.heap_data.items():
            if "struct node" in obj["type"]:
                print(f'The object type is: {obj["type"]}')
                print("Updating struct node: ")
                print(addr)
                # Get struct info by passing in address
                node_str = gdb.execute(
                    f"p *(struct node *) {addr}", to_string=True
                )  # Can replace struct node with type stored in object
                # Extract data and next field from return value         # But need to change the 'data' and 'next' extraction method
                # to generalise it for all types of structs (e.g. those with > 2 fields)
                node_str = node_str.split("=", 1)[1].strip()
                # or those with diff names
                node_str = node_str.strip("{}")
                print(node_str)
                strings = node_str.split(",")
                for assignment in strings:
                    struct_name, struct_value = assignment.split(" = ")
                    obj["data"][struct_name] = struct_value

        # === Up date existing tracked heap data
        # Make sure this is done AFTER executing the next command, so that the heap is actually updated
        for addr, obj in self.heap_data.items():
            if "struct node" in obj["type"]:
                print("Updating struct node: ")
                print(addr)
                # Get struct info by passing in address
                node_str = gdb.execute(
                    f"p *(struct node *) {addr}", to_string=True
                )  # Can replace struct node with type stored in object
                # Extract data and next field from return value         # But need to change the 'data' and 'next' extraction method
                # to generalise it for all types of structs (e.g. those with > 2 fields)
                node_str = node_str.split("=", 1)[1].strip()
                # or those with diff names
                node_str = node_str.strip("{}")
                print(node_str)
                strings = node_str.split(",")
                data_str = strings[0].split(" = ")[1]
                print(f"Data: {data_str}")
                next_str = strings[1].split(" = ")[1]
                print(f"Next: {next_str}")

                obj["data"]["data"] = data_str
                obj["data"]["next"] = next_str

            elif "struct list" in obj["type"]:
                print("Updating struct list: ")
                print(addr)
                # p *(struct list *) l
                # p *(struct list *) 0xaaab1feed2a0

                # Get struct info by passing in address
                node_str = gdb.execute(
                    f"p *(struct list *) {addr}", to_string=True
                )  # Can replace struct list with type stored in object (see comment above)
                # Extract data and next field from return value
                print(f"-----{node_str}")
                node_str = node_str.split("=", 1)[1].strip()
                node_str = node_str.strip("{}")
                print(node_str)
                strings = node_str.split(",")
                data_str = strings[0].split(" = ")[1]
                print(f"Head: {data_str}")
                next_str = strings[1].split(" = ")[1]
                print(f"Size: {next_str}")

                obj["data"]["head"] = data_str
                obj["data"]["size"] = next_str
