#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("%d\n", 0xDEAD);
    printf("%lf\n", 314159E-5);
    char myStr[] = "I like rats";
    printf("%s\n", myStr);
    myStr = {'a', 's', 's', '\0'};
    printf("%s\n", myStr);
    
    return 0;
}

