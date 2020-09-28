
// No comments:
TreeNode *insert(TreeNode *root, int value) {
    if (root == NULL) {
        return newNode(value);
    }

    if (value < root -> value) {
        root -> left = insert(root -> left, value); 
    } else if (value > root -> value) {
        root -> right = insert(root -> right, value);
    } else if (value == root -> value) {
        printf("Value %d already exists in the tree\n", value);
    }
    return root;
}

// With comments:
/**
 * Given a tree and a value, inserts that value inside the tree
 * and returns the tree with the value inserted
 */
TreeNode *insert(TreeNode *root, int value) {
    if (root == NULL) {
        // Insertion point reached if the tree is empty (vacant position)
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    if (value < root -> value) {
        // Insertion point exists somewhere in the left subtree
        root -> left = insert(root -> left, value); 
    } else if (value > root -> value) {
        // Insertion point exists somewhere in the right subtree
        root -> right = insert(root -> right, value);
    } else if  (value == root -> value) {
        // Value already exists in the tree. Doing nothing
        printf("Value %d already exists in the tree\n", value);
    }
    return root;
}