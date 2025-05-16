#include <stdio.h>

struct s
{
    int i;
    int j[2];
};

void fibonacci(int n)
{
    struct s s = {.i = 15, .j = {1, 2}};

    int a = 0, b = 1, next;
    printf("Fibonacci sequence up to %d terms:\n", n);
    for (int i = 1; i <= n; i++)
    {
        printf("%d ", a);
        next = a + b;
        a = b;
        b = next;
    }
    printf("\n");
}

int main()
{
    int n = 10;
    fibonacci(n);
    return 0;
}
