/**
 * Rebalancing a height-imbalanced node in an AVL tree.
 * 
 * Height imbalances in AVL trees occur in 4 cases:
 *   Case 1. Left-left case   - perform right rotation on current node
 *   Case 2. Left-right case  - perform left rotation on left child, 
 *                              then right rotation on current node
 *   Case 3. Right-left case  - perform right rotation on right child, 
 *                              then left rotation on current node
 *   Case 4. Right-right case - perform left rotation on current node
 */