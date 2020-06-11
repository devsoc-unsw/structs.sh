// This is also pseudocode

// What is the time-complexity of this algorithm with respect to n?
// Pushing onto the stack is O(1)
// Creating the stack is O(1)
binaryConversion(n):
    input: positive integer n
    output: binary representation of n on a stack

    create empty stack S         // O(1)
    while n > 0:                 // Looping ___ times
        push (n mod 2) onto S    // O(?)
        n = n / 2                // O(?)
    return S
























/* 
 * The complexity is determined by the number of iterations of the loop,
 * since all of the operations in the loop are constant time. The loop 
 * will run as many times as it takes to reduce a number to zero by dividing
 * by two. This is logn (base 2) times 
 */

