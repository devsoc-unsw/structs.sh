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
}
LHeight = height(root->left);
RHeight = height(root->right);
if (LHeight - RHeight > 1) {
  if (val > root->left->val) {
    root->left = rotate_left(root->left);
  }
  root = rotate_right(root);
} else if (RHeight - LHeight > 1) {
  if (val < root->right->val) {
    root->right = rotate_right(root->right);
  }
  root = rotate_left(root);
}
return root;`;

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