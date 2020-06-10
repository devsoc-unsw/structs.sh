
// "In the first phase, we iteratively pop all the elements from stack S 
// and enqueue them in queue Q"
// Pseudocode:
while S is not empty:
    item = pop(S)
    enqueue(Q, item)

// "then dequeue the elements from Q and push them back onto S."
// Pseudocode:
while Q is not empty:
    item = dequeue(Q)
    push(S, item)

// "As a result, all the elements are now in reversed order on S."

// "In the second phase, we once again pop all the elements from S, but this
// time we also look for the element x."
// Pseudocode:
while S is not empty:
    item = pop(S)
    enqueue(Q, item)
    if item = x:
        xFound = true

// "By again passing the elements through Q and back onto S, we reverse 
// the reversal, thereby restoring the original order of the elements on S."
// Pseudocode:
while Q is not empty:
    item = dequeue(Q)
    push(S, item)
