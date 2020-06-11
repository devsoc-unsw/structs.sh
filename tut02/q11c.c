#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int main(int argc, char *argv[]) {
    int n = atoi(argv[1]);
    int m = n;

    int counter = 0;
    while (n > 0) {
        counter++;
        n = n / 2;
    }

    printf("Looped %d times\n", counter);
    printf("Base 2 log(%d): %lf\n", m, log(m) / log(2.0));
    return 0;
}

