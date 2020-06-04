#include <stdio.h>

// Iterative version. Very boring
int factorialIterative(int n) {
    int result = 1;
    while (n >= 1) {
        result *= n;
        n -= 1;
    }
    return result;
}

// Recursive version! 
int factorialRecursive(int n) {
    if (n == 1) {
        return 1
    } else {
        int subSolution = factorialRecursive(n - 1);
        int solution = n * subSolution;
        return solution;
    }
}

int main() {
    printf("%d\n", mysteryFunction(8));
    printf("%d\n", factorialIterative(8));
    return 0;
}
