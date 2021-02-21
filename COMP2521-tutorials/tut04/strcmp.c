#include <stdio.h>
#include <string.h>

int main() {
    // When string1 is alphabetically BEFORE string2: strcmp returns -1
    int result = strcmp("cat", "doggo");
    printf("strcmp(%s, %s) = %d\n", "cat", "dog", result);

    // When string1 is alphabetically AFTER string2: strcmp returns 1
    result = strcmp("bear", "ant");
    printf("strcmp(%s, %s) = %d\n", "bear", "ant", result);

    // When string1 is EQUAL to string2: strcmp returns 0
    result = strcmp("doggo", "doggo");
    printf("strcmp(%s, %s) = %d\n", "doggo", "doggo", result);
    return 0;
}
