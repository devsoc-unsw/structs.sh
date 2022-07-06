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
  
  int balance = height(node->left) - height(node->right);
  /* Balance the current node in the four cases where the current node is unbalanced */
  // Left Left Case
  if (balance > 1 && value < node->left->value)
    return rotate_right(node);

  // Right Right Case
  if (balance < -1 && value > node->right->value)
    return rotate_left(node);

  // Left Right Case
  if (balance > 1 && value > node->left->value) {
    node->left =  rotate_left(node->left);
    return rotate_right(node);
  }

  // Right Left Case
  if (balance < -1 && value < node->right->value) {
    node->right = rotate_right(node->right);
    return rotate_left(node);
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
