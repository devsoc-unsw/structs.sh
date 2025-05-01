#include <stdio.h>

#define print printf("doing something...\n")

int main(int argc, char **argv)
{
    print;
    int uninitted_int;
    print;
    int initted_int = 2;
    print;
    int *uninitted_intp;
    print;
    int *initted_intp = &initted_int;
    print;
    uninitted_int = 1;
    print;
    uninitted_intp = &uninitted_int;
    print;
}
