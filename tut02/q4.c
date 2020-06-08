#include <stdio.h>


// x^n
// Iterative mindset: x * x * x * x * x ...  * x
int pow(int x, unsigned int n) {
   int result = 1;
    for (int i = 0; i < n; i++) {
        result *= x;
    }
   return result;
}

// 2 ^ 7
// Recursive mindset: 2 * 2^6
// x^(n-1)
// x^(n-1) = x * x^(n-2)
// x^(n-2)
// x^(n-2) = x * x^(n-3)
// ...
// 1 = x

int pow2(int x, unsigned int n) {
    if (n == 0) {
        return 1;
    }
    return x * pow2(x, n - 1); 
}

// x^n
// x^(n/2) * x^(n/2)
