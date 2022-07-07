export const insertCodeSnippet = `struct node *insert(struct node *node, int value) {
    /* First perform a normal BST insertion */
    if (node == null)
        return create_new_node(value);

    if (value < node->value)
        node->left = insert(node->left, value);
    if (value > node->value)
        node->right = insert(node->right, value);
    return node;

    node->height = height(node);
    
    /* Balance the current node */
    int balance = height(node->left) - height(node->right);
    if (balance > 1 && value > node->left->value) {
        if (value > node->left->value) {
            // Left Right Case
            node->left =  rotate_left(node->left);
        }
        // Left Left Case
        return rotate_right(node);
    } else if (balance < -1) {
        if (value < node->right->value) {
            // Right Left Case
            node->right = rotate_right(node->right);
        }
        // Right Right Case
        return rotate_left(node);
    }
    
    /* Return unchanged node if it is already balanced */
    return node;
}`;

export const inorderTraversalCodeSnippet = `void inorder_traversal(struct node *node) {
    if (node == NULL) 
        return;

    inorder_traversal(node->left);
    printf("%d ", node->value);
    inorder_traversal(node->right);
}`;

export const preorderTraversalCodeSnippet = `void preorder_traversal(struct node *node) {
    if (node == NULL) 
        return;

    printf("%d ", node->value);
    preorder_traversal(node->left);
    preorder_traversal(node->right);
}`;

export const postorderTraversalCodeSnippet = `void postorder_traversal(struct node *node) {
    if (node == NULL) 
        return;

    postorder_traversal(node->left);
    postorder_traversal(node->right);
    printf("%d ", node->value);
}`;
