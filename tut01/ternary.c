#include <stdio.h>
#include <ctype.h>

int factorial(int n) {
    if (n == 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    char ch; 
    char *type;

    // Usual way of doing if-else logic:
    ch = getchar();
    if (isdigit(ch))
        type = "digit";
    else
        type = "non-digit";
    printf("'%c' is a %s\n", ch, type);

    // Chad way of doing if-else logic - using ternary operators:
    // ch = getchar();
    // type = isdigit(ch) ? "digit" : "non-digit";
    // printf("'%c' is a %s\n", ch, type);

    return 0;
}