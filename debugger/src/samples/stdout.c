#include <stdio.h>
#include <stdlib.h>

int main() { setbuf(stdout, NULL);
  puts("Hello World 1");
  printf("Hello World 2\n");
  fputs("Hello World 3\n", stdout);
  fputc('H', stdout);
  printf("ello World 4\n:");
}