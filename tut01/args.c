#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("You have given me %d arguments. They are:\n", argc);
    for (int i = 0; i < argc; i++) {
        printf("---> %s\n", argv[i]);
    }
    return EXIT_SUCCESS;
}
