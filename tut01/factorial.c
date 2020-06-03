#include <stdio.h>

// Iterative version. Very boring
int factorial(int n) {
    int result = 1;
    while (n >= 1) {
        result *= n;
        n -= 1;
    }
    return result;
}

// Recursive version! 
int mysteryFunction(int n) {
    if (n == 1) return 1;
    return n * mysteryFunction(n - 1);
}

int main() {
    printf("%d\n", mysteryFunction(8));
    printf("%d\n", factorial(8));
    return 0;
}
