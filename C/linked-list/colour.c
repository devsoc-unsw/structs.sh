#include <stdio.h>

void red () {
  printf("\033[1;31m");
}

void green() {
  printf("\033[1;32m");
}

void violet(char *text) {
    printf("\033[0;35m");
    printf("%s", text);
    printf("\033[0m");
}
