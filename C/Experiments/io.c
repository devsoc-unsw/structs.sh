#include <stdio.h>

int main() {
    int myVar;
    char myStr[128];
    printf("Give me a number: ");
    scanf("%d", &myVar);
    printf("Give me a string: ");
    scanf("%s", myStr);
    printf("You entered: %d (%p)\n", myVar, &myVar);
    printf("You entered: %s (%p)\n", myStr, &myStr);
    return 0;
}
