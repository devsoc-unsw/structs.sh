#include <stdio.h>
#include <stdlib.h>

int main() {
    // Curly braces aren't needed if you only have 1 statement to run
    if (1) printf("Yes, this if statement is valid!\n");
    
    int n = 4;
    while (n = n - 1)  // Yup, you can have assignment statements in a while loop  
        printf("Yes, this while loop is valid\n");

    // You can declare several variables at once
    int a, b, c;

    // And initialise some or all of them while you're at it
    int d, e = 42, f;

    // You can also assign several variables to the same variable in one line like this:
    a = b = c = d = e;
    printf("c = %d\n", c);

    // Assignment is always done from right to left. 
    // "Take what's on the right and assign it to what's on the left"
    a = b = c = d = e = 420;
    printf("c = %d\n", c);

    // Nothing is stopping us from using uninitialised variables
    printf("f = %d\n", f);
    
    char *myString;
    printf("myString = %s\n", myString);

    return 0;
}
