from pycparser import parse_file, c_ast

# Define a visitor class to traverse the AST and find malloc assignments
class MallocVisitor(c_ast.NodeVisitor):
    def __init__(self):
        self.malloc_variables = []

    def visit_Assignment(self, node):
        # Check if the assignment is of the form "variable = malloc(...)"
        if isinstance(node.rvalue, c_ast.FuncCall) and isinstance(node.rvalue.name, c_ast.ID) and node.rvalue.name.name == 'malloc':
            if isinstance(node.lvalue, c_ast.StructRef):
                var_name = self.get_variable_name(node.lvalue)
                self.malloc_variables.append(var_name)
            elif isinstance(node.lvalue, c_ast.ID):
                self.malloc_variables.append(node.lvalue.name)
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

# Input C code file and compiled output file
input_c_file = "malloc2.c"

ast = parse_file(input_c_file, use_cpp=True)

# Create the visitor and traverse the AST
malloc_visitor = MallocVisitor()
malloc_visitor.visit(ast)

# Print the variable names assigned to malloc
print("Variables assigned to malloc:")
for var in malloc_visitor.malloc_variables:
    print(var)
