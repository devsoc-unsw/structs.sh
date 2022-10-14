export const insertCodeSnippet = `struct node *insert(struct node *node, int value) {
    if (node == null)
        return create_new_node(value);

    if (value < node->value)
        node->left = insert(node->left, value);
    else if (value > node->value)
        node->right = insert(node->right, value);
    return node;
  }`;

export const rotateLeftCodeSnippet = `struct node *rotate_left(struct node *node, int value) {
    if (value == node->value) {
        struct node *new_root = node->right;
        node->right = new_root->left;
        new_root->left = node;
        return new_root;
    } else if (value < node->value) {
        node->left = rotate_left(node->left, value);
    } else if (value > node->value) {
        node->right = rotate_left(node->right, value);
    }
    return node;
}`;

export const rotateRightCodeSnippet = `struct node *rotate_right(struce node *node, int value) {
    if (value == node->value) {
        struct node *new_root = node->left;
        node->left = new_root->right;
        new_root->right = node;
        return new_root;
    } else if (value < node->value) {
        node->left = rotate_right(node->left, value);
    } else if (value > node->value) {
        node->right = rotate_right(node->right, value);
    }
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
