#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int someFunction(int n) {
    int numLoops = 0;
    for (int i = 1; i < n; i = i * 2) {
        numLoops++;
    }
    printf("I looped %d times!\n", numLoops);
    printf("Also, log₂(%d) = %lf\n", n, log(n) / log(2));
}

int main(int argc, char *argv[]) {
    someFunction(atoi(argv[1]));
}
