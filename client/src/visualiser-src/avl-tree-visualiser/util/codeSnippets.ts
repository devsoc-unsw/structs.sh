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
  if (node == NULL)
        return node;

  struct node *new_root = node;
  if (value < node->value) {
      node->left = delete(node->left, value);
  } else if (value > node->value) {
      node->right = delete(node->right, value);
  } else {
      if (node->left == NULL && node->right == NULL) {
          new_root = NULL;
      } else if (node->left == NULL) {
          new_root = node->right;
      } else if (node->right == NULL) {
          new_root = node->left;
      } else {
          new_root = tree_join(node->left, node->right);
      }
      free(node);
  }

  if (new_root == NULL)
    return new_root;

  new_root->height = height(new_root);
  int balance = height(new_root->left) - height(new_root->right);
  if (balance > 1) {
    if (getBalance(new_root->left) >= 0)
      new_root = rotate_right(new_root);
    else {
      new_root->left = rotate_left(new_root->left);
      new_root = rotate_right(new_root);
    }
  } else if (balance < -1) {
    if (getBalance(new_root->right) <= 0)
      new_root = rotate_left(new_root);
    else {
      new_root->right = rotate_right(new_root->right);
      new_root = rotate_left(new_root);
    }
  }
  return new_root;
}`;
