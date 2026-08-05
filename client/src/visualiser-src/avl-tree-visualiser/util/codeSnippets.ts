export const insertCodeSnippet = `struct node *insert(struct node *node, int value) {
    if (node == null)
        return create_new_node(value);
    if (value < node->value)
        node->left = insert(node->left, value);
    else if (value > node->value)
        node->right = insert(node->right, value);
    else if (value == node->value)
        return node;

    node->height = height(node);
    int balance = height(node->left) - height(node->right);
    if (balance > 1) {
        if (value > node->left->value) 
            node->left = rotate_left(node->left);
        return rotate_right(node);
    } else if (balance < -1) {
        if (value < node->right->value) 
            node->right = rotate_right(node->right);
        return rotate_left(node);
    } else {
        return node;
    }
}`;

export const deleteCodeSnippet = `struct node *delete(struct node *node, int value) {
    if (node == null) {
        return node;
    } else if (value < node->value) {
        node->left = delete(node->left, value);
    } else if (value > node->value) {
        node->right = delete(node->right, value);
    } else {
        if (node->left == null) {
            struct node *temp = node->right;
            free(node);
            return temp;
        } else if (node->right == null) {
            struct node *temp = node->left;
            free(node);
            return temp;
        } else {
            struct node *successor = find_min(node->right);
            node->value = successor->value;
            node->right = delete(node->right, successor->value);
        }
    }

    node->height = height(node);
    int balance = get_balance(node);
    if (balance > 1) {
        if (get_balance(node->left) < 0) {
            node->left = rotate_left(node->left);
        }
        return rotate_right(node);
    } else if (balance < -1) {
        if (get_balance(node->right) > 0) {
            node->right = rotate_right(node->right);
        }
        return rotate_left(node);
    }
    return node;
}`;
