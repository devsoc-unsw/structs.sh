export const insertCodeSnippet =
`if (root == NULL) {
  root = create_node(val);
  return;
}
while (curr != NULL) {
  if (val < curr->val) {
    if (curr->left == NULL) {
      curr->left = create_node(val);
      return;
    }
    curr = curr->left;
  } else {
    if (curr->right == NULL) {
      curr->right = create_node(val);
      return;
    }
    curr = curr->right;
  }
}`;

export const rotateLeftCodeSnippet =
`if (val == node->val) {
  struct node *new_root = node->right;
  node->right = new_root->left;
  new_root->left = node;
  return new_root;
} else if (val < node->val) {
  node->left = rotate_left(node->left, val);
} else {
  node->right = rotate_left(node->right, val);
}
return node;`;

export const rotateRightCodeSnippet =
`if (val == node->val) {
  struct node *new_root = node->left;
  node->left = new_root->right;
  new_root->right = node;
  return new_root;
} else if (val < node->val) {
  node->left = rotate_right(node->left, val);
} else {
  node->right = rotate_right(node->right, val);
}
return node;`;

export const inorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
inorder_traversal(node->left);
printf("%d ", node->val);
inorder_traversal(node->right);`;

export const preorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
printf("%d ", node->val);
preorder_traversal(node->left);
preorder_traversal(node->right);`;

export const postorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
postorder_traversal(node->left);
postorder_traversal(node->right);
printf("%d ", node->val);`;