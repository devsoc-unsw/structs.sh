#include <stdio.h>
#include <string.h>

struct student {
    int id;
    double wam;
    char name_first[32];
    char name_last[32];
    char* town;
    char** letters;
};

int main(void) {
    // === Student 2
    struct student jimmy;

    jimmy.id = 5555555;
    jimmy.wam = 50.17;

    strncpy(jimmy.name_first, "Jimmy", 32);
    strncpy(jimmy.name_last, "Jimmerson", 32);

    char* town1 = "campbelltown";
    jimmy.town = town1;

    char* letters1 = "abcd";
    jimmy.letters = &letters1;

    // === Student 2
    struct student gallant;

    gallant.id = 5555556;
    gallant.wam = 99.99;

    strncpy(gallant.name_first, "Gallant", 32);
    strncpy(gallant.name_last, "Jimmerson", 32);

    char* town2 = "westmead";
    gallant.town = town2;

    char* letters2 = "wxyz";
    gallant.letters = &letters2;

    // ===
    printf("%s's ID is %d\n", jimmy.name_first, jimmy.id);
    printf("%s's ID is %d\n", gallant.name_first, gallant.id);

    int important_numbers[5] = {10, 20, 30, 40, 42};

    struct student *jimmy_ptr = &jimmy;

    printf("Final line!\n");

    return 0;
}
