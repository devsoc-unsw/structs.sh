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

  if (value < node->value)
    node->left = delete(node->left, value);
  else if (value > node->value)
    node->right = delete(node->right, value);
  else {
    if (node->left == NULL || node->right == NULL) {
      struct node *temp = node->left ? node->left : node->right;
      if (temp == NULL) {
        temp = node;
        node = NULL;
      } else {
        *node = *temp;
      }
      free(temp);
    } else {
      struct node* temp = min_value_node(node->right);
      node->value = temp->value;
      node->right = delete(node->right, temp->value);
    }
  }

  if (node == NULL)
    return node;

  node->height = height(node);
  int balance = height(node->left) - height(node->right);

  if (balance > 1) {
      if (height(node->left->left) >= height(node->left->right))
          node = rotate_right(node);
      else {
          node->left = rotate_left(node->left);
          node = rotate_right(node);
      }
  } else if (balance < -1) {
      if (height(node->right->right) >= height(node->right->left))
          node = rotate_left(node);
      else {
          node->right = rotate_right(node->right);
          node = rotate_left(node);
      }
  }

  return node;
}`;
