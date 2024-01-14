#include <stdio.h>
#include <stdlib.h>
#define BUF_SIZE 5

int main() {
  int dividend = 0;
  int divisor = 1;
  printf("Enter dividend and divisor as two ints, space-separated: ");
  if (scanf("%d %d", &dividend, &divisor) == 2) {
    printf("Quotient: %d\n", dividend / divisor);
  }

  getchar(); // Consume the newline character after end scanf

  char buf[BUF_SIZE];
  printf("Enter a string of 4 chars: ");
  char *written_buf = fgets(buf, BUF_SIZE, stdin);
  if (written_buf != NULL) {
    printf("Written: %s\n", written_buf);
  }

  printf("Enter a char: ");
  int read_c = fgetc(stdin);
  printf("Read character using fgetc: %c\n", read_c);
  getchar(); // Consume the newline character after end fgetc

  printf("Enter a char: ");
  read_c = getchar();
  printf("Read character using getchar: %c\n", read_c);
}
