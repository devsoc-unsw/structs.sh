export const insertCodeSnippet =
`if (root == NULL) {
  root = createNode(val);
  return;
}
while (curr != NULL) {
  if (val < curr->val) {
    if (curr->left == NULL) {
      curr->left = createNode(val);
      return;
    }

    curr = curr->left;
  } else {
    if (curr->right == NULL) {
      curr->right = createNode(val);
      return;
    }

    curr = curr->right;
  }
}`;

export const rotateLeftCodeSnippet =
`if (val == node->val) {
  Node* newRoot = node->right;
  node->right = newRoot->left;
  newRoot->left = node;
  return newRoot;
} else if (val < node->val) {
  node->left = rotateLeft(node->left, val);
} else {
  node->right = rotateLeft(node->right, val);
}
return node;`;

export const rotateRightCodeSnippet =
`if (val == node->val) {
  Node* newRoot = node->left;
  node->left = newRoot->right;
  newRoot->right = node;
  return newRoot;
} else if (val < node->val) {
  node->left = rotateRight(node->left, val);
} else {
  node->right = rotateRight(node->right, val);
}
return node;`;

export const inorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
inorderTraversal(node->left);
printf("%d ", node->val);
inorderTraversal(node->right);`;

export const preorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
printf("%d ", node->val);
preorderTraversal(node->left);
preorderTraversal(node->right);`;

export const postorderTraversalCodeSnippet =
`if (node == NULL) {
  return;
}
postorderTraversal(node->left);
postorderTraversal(node->right);
printf("%d ", node->val);`;