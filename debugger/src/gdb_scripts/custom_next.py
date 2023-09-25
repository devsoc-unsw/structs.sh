import os
from pprint import pprint
import gdb
import subprocess
from pycparser import parse_file, c_ast
import re
from src.constants import USER_MALLOC_CALL_FILE_NAME, USER_MALLOC_CALL_PREPROCESSED, USER_PTYPE_FILE_NAME, USER_PTYPE_PREPROCESSED
from src.utils import create_abs_file_path

from src.gdb_scripts.use_socketio_connection import useSocketIOConnection, enable_socketio_client_emit

# Parent directory of this python script e.g. "/user/.../debugger/src/gdb_scripts"
# In the docker container this will be "/app/src/gdb_scripts"
# You can then use this to reference files relative to this directory.
abs_file_path = os.path.dirname(os.path.abspath(__file__))


class MallocVisitor(c_ast.NodeVisitor):
    def __init__(self):
        self.malloc_variables = []
        self.free_variables = []
        self.free = "False"

    def visit_Assignment(self, node):
        print("MallocVisitor.vist_Assignment:")
        print(node)
        # Check if the assignment is of the form "variable = malloc(...)"
        if isinstance(node.rvalue, c_ast.FuncCall) and isinstance(node.rvalue.name, c_ast.ID) and node.rvalue.name.name == 'malloc':
            if isinstance(node.lvalue, c_ast.StructRef):
                var_name = self.get_variable_name(node.lvalue)
                self.malloc_variables.append(var_name)
            elif isinstance(node.lvalue, c_ast.ID):
                self.malloc_variables.append(node.lvalue.name)
        self.generic_visit(node)

    def visit_FuncCall(self, node):
        # Check if the function call is to "free(variable)"
        if isinstance(node.name, c_ast.ID) and node.name.name == 'free':
            self.free = "True"
            if len(node.args.exprs) == 1 and isinstance(node.args.exprs[0], c_ast.ID):
                self.free_variables.append(node.args.exprs[0].name)
        self.generic_visit(node)

    def visit_Decl(self, node):
        # Check if the declaration initializes with malloc, e.g., "Type *var = malloc(...)"
        if node.init and isinstance(node.init, c_ast.FuncCall) and isinstance(node.init.name, c_ast.ID) and node.init.name.name == 'malloc':
            if isinstance(node.type, c_ast.PtrDecl):
                var_name = node.name
                self.malloc_variables.append(var_name)
        self.generic_visit(node)

    def get_variable_name(self, node):
        # Recursively get the variable name from the pointer chain
        if isinstance(node, c_ast.StructRef):
            base = self.get_variable_name(node.name)
            field = node.field.name
            return f"{base}->{field}"
        elif isinstance(node, c_ast.ID):
            return node.name
        return None


class CustomNextCommand(gdb.Command):
    '''
    To be run in gdb:

    (gdb) python CustomNextCommand("custom_next")
    (gdb) custom_next
    (gdb) # alternatively, run with python...
    (gdb) python backend_dict = gdb.execute("custom_next", to_string=True)

    '''

    def __init__(self, cmd_name, user_socket_id, debug_session=None):
        super(CustomNextCommand, self).__init__(cmd_name, gdb.COMMAND_USER)
        self.user_socket_id = user_socket_id
        self.debug_session = debug_session
        self.heap_data = {}
        self.break_on_all_user_defined_functions()

    def invoke(self, arg=None, from_tty=None):
        # TODO: detect end of debug session
        # if any(t.is_running() for t in gdb.selected_inferior().threads()):
        #     print("\n=== Running CustomNextCommand in gdb...")
        # else:
        #     print("\n=== CustomNextCommand not run because no debuggin session is active")
        #     return

        print("\n=== Running CustomNextCommand in gdb...")

        frame_info = get_frame_info()

        temp_line = gdb.execute('frame', to_string=True)
        raw_str = (temp_line.split('\n')[1]).split('\t')[1]
        line_str = remove_non_standard_characters(raw_str)

        temp_line = gdb.execute('frame', to_string=True)
        raw_str = (temp_line.split('\n')[1]).split('\t')[1]
        line_str = remove_non_standard_characters(raw_str)

        assert self.debug_session is not None

        # Create a complete C code file with function prototypes, main, and variable line
        c_code_for_preprocessing = "\n".join(
            self.debug_session.get_cached_type_decl_strs()) + "\nint main(int argc, char **argv) {\n" + line_str + "\n}"
#         c_code_for_preprocessing = """
# struct node {
#     int data;
#     struct node *next;
# };

# typedef struct list {
#     struct node *head;
#     int size;
# } List;
# int main(int argc, char **argv) {
# """
#         c_code_for_preprocessing = c_code_for_preprocessing + line_str + "\n}"
        print(f"{c_code_for_preprocessing=}")
        '''
        c_code_for_preprocessing will be a string looking like this:
        ```
        typedef struct list List;
        struct list;
        struct node;

        List *l = malloc(sizeof(List));
        '''

        # === Intercept call to malloc, if present

        # Write the complete C code to a file
        with open(create_abs_file_path(USER_MALLOC_CALL_FILE_NAME), "w") as f:
            f.write(c_code_for_preprocessing)

        subprocess.run(f"gcc -E {create_abs_file_path(USER_MALLOC_CALL_FILE_NAME)} > {create_abs_file_path(USER_MALLOC_CALL_PREPROCESSED)}",
                       shell=True)
        try:
            # Parse the preprocessed C code into an AST
            # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
            line_ast = parse_file(create_abs_file_path(USER_MALLOC_CALL_PREPROCESSED), use_cpp=True,
                                  cpp_args=r'-Iutils/fake_libc_include')

            # print(line_ast)

            # Create a MallocVisitor instance
            malloc_visitor = MallocVisitor()

            # Set the current node to the root of the AST
            malloc_visitor.current_node = line_ast

            # Visit the AST to check for malloc calls
            malloc_visitor.visit(line_ast)

            # Print the variable names assigned to malloc
            if len(malloc_visitor.malloc_variables) > 0:
                print("Variables assigned to malloc:")
                for var_assigned_to_malloc in malloc_visitor.malloc_variables:
                    print(f"{var_assigned_to_malloc=}")

                    stack_var_type_name = get_type_name_of_stack_var(
                        var_assigned_to_malloc)
                    # stack_var_type_name == "struct node*"

                    # Break on malloc
                    gdb.execute('break')

                    # Step into malloc
                    gdb.execute('step')

                    # Use p bytes to get the bytes allocated
                    temp_bytes = gdb.execute('p bytes', to_string=True)
                    bytes = temp_bytes.split(" ")[2]
                    # Remove \n from bytes
                    bytes = re.sub(r'\n', '', bytes)
                    print(f"Bytes allocated: {bytes}")

                    # Get the address returned by malloc
                    gdb.execute('finish')
                    temp_address = gdb.execute('print $', to_string=True)
                    address = re.sub(r'\n', '', temp_address.split(' ')[-1])
                    print(f"address EXTRACTED: {address}")

                    # === Extract linked list node data given the variable name
                    print(f"Attempting to print \"{var_assigned_to_malloc}\"")
                    struct_fields_str = gdb.execute(
                        f'p *({stack_var_type_name}) {address}', to_string=True)

                    # Conventional struct node might look like this
                    # $4 = {data = 542543, next = 0x0}

                    # User's struct node might look like this:
                    # $4 = {cockatoo = 0, pigeon = 0x0}

                    # Beware uninitialised struct nodes might look like this:
                    # $3 = {data = -670244016, next = 0xffffa15f74cc <__libc_start_main_impl+152>}

                    struct_fields_str = struct_fields_str.split("=", 1)[
                        1].strip()
                    struct_fields_str = struct_fields_str.strip("{}")
                    print(f"{struct_fields_str=}")
                    # struct_fields_str == "data = 542543, next = 0x0"

                    struct_type_name = stack_var_type_name.strip('*').strip()
                    new_struct_value = create_struct_value(
                        self.debug_session.get_cached_parsed_type_decls(), struct_fields_str, struct_type_name, address)

                    heap_memory_value = {
                        # "variable": var, ## Name of stack var storing the address of this piece of heap data
                        "typeName": struct_type_name,
                        # "size": bytes, ## Size of the type in bytes
                        "value": new_struct_value,
                        "addr": address
                    }

                    self.heap_data[address] = heap_memory_value
                    print("Heap data:")
                    pprint(self.heap_data)

            else:
                print("Current line does not contain call to malloc")

            # Print the variable names being freed
            print(malloc_visitor.free)
            print("Variables being freed:")
            for var_assigned_to_malloc in malloc_visitor.free_variables:
                print(var_assigned_to_malloc)

        except Exception as e:
            print("An error occurred while intercepting potential malloc: ", e)

        # TODO: Need a way to detect if program exits, then send signal to server
        # which should tell the client that the debugging session is over.
        gdb.execute('next')

        # == Get stack data after executing next command
        stack_data = get_stack_data()

        # === Up date existing tracked heap data
        # Make sure this is done AFTER executing the next command, so that the heap is actually updated
        for addr, heap_memory_value in self.heap_data.items():
            struct_type_name = heap_memory_value["typeName"]
            address = heap_memory_value["addr"]

            # Get struct info by passing in address
            struct_fields_str = gdb.execute(
                f'p *({struct_type_name} *) {addr}', to_string=True)       # Can replace struct node with type stored in object
            # TODO: Heap dictionary assumes its working with structs, should ideally be generalised to all types
            # Extract all struct fields
            struct_fields_str = struct_fields_str.split("=", 1)[1].strip()
            # or those with diff names
            struct_fields_str = struct_fields_str.strip("{}").strip()
            # struct_fields_str == "data = 542543, next = 0x0"

            new_heap_memory_value = create_struct_value(
                self.debug_session.get_cached_parsed_type_decls(), struct_fields_str, struct_type_name, address)

            self.heap_data[addr] = new_heap_memory_value

        backend_data = {
            "frame_info": frame_info,
            "stack_data": stack_data,
            "heap_data": self.heap_data
        }
        send_backend_data_to_server(
            self.user_socket_id, backend_data=backend_data)

        print(f"\n=== Finished running update_backend_state in gdb instance\n\n")
        return backend_data

    def get_heap_dict(self):
        return self.heap_data

    def break_on_all_user_defined_functions(self):
        '''
        Break on all user-defined functions in the program so that the custom next command will step into it.
        '''
        functions = self.debug_session.get_cached_parsed_fn_decls()
        for func_name in functions.keys():
            gdb.execute(f"break {func_name}")


@useSocketIOConnection
def send_backend_data_to_server(user_socket_id: str = None, backend_data: dict = {}, sio=None):
    '''
    Args:
        - backend_data: dict containing data for the current stack frame and 
            also the heap, in the following format:
            {
                "frame_info": {
                    "file": "file_name",
                    "line": "line_number",
                    "function": "function_name"
                },
                "stack_data": [
                    {
                        "name": "var_name",
                        "value": "var_value",
                        "type": "var_type"
                    },
                    ...
                ],
                "heap_data": {
                    "addr": {
                        "variable": ..., ## Name of stack var storing the address of this piece of heap data
                        "type": ...,
                        "size": ...,
                        "data": ...,
                        "addr": ...
                    },
                    ...
                }
            }
    '''
    if user_socket_id is not None:
        print(
            f"Sending backend_data to server, for user with socket_id {user_socket_id}")
        sio.emit("updatedBackendState",
                 (user_socket_id, backend_data))

        enable_socketio_client_emit()

    else:
        print("No user_socket_id provided, so not sending backend_data to server")


def remove_non_standard_characters(input_str):
    # Remove color codes and non-standard characters using a regular expression
    clean_str = re.sub(r'\x1b\[[0-9;]*[mK]', '', input_str)
    return clean_str


def create_struct_value(parsed_type_decls, struct_fields_str, struct_name, address):
    # Find the type declaration for the struct type being malloced
    print("parsed type decls")
    pprint(parsed_type_decls)
    corresponding_type_decl = next((x for x in parsed_type_decls if (
        lambda x: "name" in x and x['name'] == struct_name)), None)
    if corresponding_type_decl is None:
        raise Exception(
            f"No corresponding type declaration found for {struct_name}")

    value = {}
    for field in struct_fields_str.split(','):
        field = field.strip()
        field_name = field.split('=')[0].strip()
        field_value = field.split('=')[1].strip()
        print(f"{field_name=}", f"{field_value=}")
        value[field_name] = {
            "typeName": next((field['typeName'] for field in corresponding_type_decl['fields'] if field['name'] == field_name), ""),
            "value": field_value}

    return {
        # "variable": var, ## Name of stack var storing the address of this piece of heap data
        "typeName": struct_name,
        # "size": bytes, ## Size of the type in bytes
        "value": value,
        "addr": address
    }


def get_type_name_of_stack_var(var: str):
    ptype_output_str = gdb.execute(f"ptype {var}", to_string=True)
    type_name_str = ptype_output_str.strip("type = ")
    return get_type_name(type_name_str.strip())


def get_type_name(type_name_str: str):
    print(f"{type_name_str=}")
    if (type_name_str.endswith('*')):
        type_name_str = type_name_str[:-1]
        sub_type_name = get_type_name(type_name_str.strip())
        return f"{sub_type_name}*"
    elif (type_name_str.startswith('struct ')):
        # == No longer need this after accounting for pointers recursively
        # STRUCT_PTR_STR = '} *'
        # if (type_name_str.endswith(STRUCT_PTR_STR)):
        #     type_name_str = type_name_str.replace(STRUCT_PTR_STR, '};')

        if (type_name_str.endswith('}')):
            type_name_str = type_name_str + ';'
        # Write the ptype to a file
        with open(create_abs_file_path(USER_PTYPE_FILE_NAME), "w") as f:
            f.write(type_name_str)

        subprocess.run(f"gcc -E {create_abs_file_path(USER_PTYPE_FILE_NAME)} > {USER_PTYPE_PREPROCESSED}",
                       shell=True)

        # Parse the preprocessed C code into an AST
        # `cpp_args=r'-Iutils/fake_libc_include'` enables `#include` for parsing
        ptype_ast = parse_file(USER_PTYPE_PREPROCESSED, use_cpp=True,
                               cpp_args=r'-Iutils/fake_libc_include')

        # Print the outermost struct name found in the AST
        type_name = "struct " + find_outermost_struct_name(ptype_ast)
    else:
        type_name = type_name_str.strip()

    return type_name


def find_outermost_struct_name(node):
    if isinstance(node, c_ast.Struct):
        return node.name
    for _, child in node.children():
        result = find_outermost_struct_name(child)
        if result:
            return result
    return None


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

    variables: dict = {}
    for var in variable_list:
        stack_memory_value: dict = {}
        assert (" = " in var)
        name, value_str = var.split(" = ", 1)

        # TODO: parse value_str to correct python type
        stack_memory_value["value"] = value_str

        type_name = get_type_name_of_stack_var(name)
        stack_memory_value["type"] = type_name

        # TODO: get address of this memory value
        stack_memory_value["address"] = "0x0"
        variables[name] = stack_memory_value

    return variables
