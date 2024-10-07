from pycparser import c_ast

class MallocVisitor(c_ast.NodeVisitor):
    def __init__(self):
        self.malloc_variables = []
        self.free_variables = []
        self.arr_subscript_depth = 0;

    def visit_Assignment(self, node):
        print("MallocVisitor.visit_Assignment:")
        print(node)
        # Check if the assignment is of the form "variable = malloc(...)"
        if ((rvalue := (isinstance(node.rvalue, c_ast.Cast) and node.rvalue.expr) or
             (isinstance(node.rvalue, c_ast.FuncCall) and node.rvalue)) and isinstance(rvalue.name, c_ast.ID) and rvalue.name.name == 'malloc'):
            if isinstance(node.lvalue, c_ast.StructRef):
                var_name = self.get_variable_name(node.lvalue)
                self.malloc_variables.append(var_name)
            elif isinstance(node.lvalue, c_ast.ArrayRef):
                # Check if subscript (index) is involved and have function check what current i value is
                self.arr_subscript_depth = self.get_subscript_depth(node.lvalue)
                self.malloc_variables.append(node.lvalue.name.name)
            elif isinstance(node.lvalue, c_ast.ID):
                self.malloc_variables.append(node.lvalue.name)
        self.generic_visit(node)

    def visit_FuncCall(self, node):
        # Check if the function call is to "free(variable)"
        if isinstance(node.name, c_ast.ID) and node.name.name == 'free':
            if len(node.args.exprs) == 1 and isinstance(node.args.exprs[0], c_ast.ID):
                self.free_variables.append(node.args.exprs[0].name)
        self.generic_visit(node)

    def visit_Decl(self, node):
        # Check if the declaration initializes with malloc, e.g., "Type *var = malloc(...)"
        if node.init:
            if (init :=
                (isinstance(node.init, c_ast.Cast) and node.init.expr)
                or (isinstance(node.init, c_ast.FuncCall) and node.init)
            ) and isinstance(init.name, c_ast.ID) and init.name.name == 'malloc':
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
    
    def get_subscript_depth(self, node):
        if hasattr(node, "subscript"):
            return 1 + self.get_subscript_depth(node.name)
        else:
            return 0
