#include <stdio.h>
#include <stdlib.h>

int main() {
    int *list = malloc(sizeof(*list)*3);
    list[0] = 7;
    list[1] = 8;
    list[2] = 512;
}