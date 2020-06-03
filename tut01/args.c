#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("You have given me %d arguments. They are\n", argc);
    for (int i = 1; i <= argc; i++) {
        printf("%d: %s\n", i, argv[i]);
    }
    return 0;
}
