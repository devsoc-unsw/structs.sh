#include <stdio.h>

int factorial(int n) {
    if (n == 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int a = 42;
    int b = 420;
    int c;

    // Usual way of doing if-else logic:
    if (a < b) {
        c = a;
    } else {
        c = b;
    }
    printf("c = %d\n", c);

    // Chad way of doing if-else logic - using ternary operators:
    c = (a < b) ? a : b;
    printf("c = %d\n", c);

    return 0;
}