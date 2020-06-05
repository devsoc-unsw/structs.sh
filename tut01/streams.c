#include <stdio.h>
#include <stdlib.h>

void somethingTerribleHasHappened() {
    fprintf(stderr, "Something terrible has happened. Exiting the program.\n");

    // These two lines are exactly equivalent:
    fprintf(stdout, "Something terrible has happened. Exiting the program.\n");
    printf("Something terrible has happened. Exiting the program.\n");

    // All 3 of the 'printfs' do the same thing: they print onto the terminal

    // Aborts the program immediately. EXIT_FAILURE is a #defined constant inside stdlib.h
    exit(EXIT_FAILURE);
}

void readingStdin() {
    int a;
    int b;

    // These two lines are exactly equivalent:
    fscanf(stdin, "%d", &a);
    scanf("%d", &b);

    printf("a = %d\n", a);
    printf("b = %d\n", b);


    int c;

    // sscanf lets you read from a string rather than from a file stream
    sscanf("4", "%d", &c);

    printf("c = %d\n", c);

    // The exit status can be any integer, but maybe stick with EXIT_SUCCESS and EXIT_FAILURE
    exit(420);
}

void readFromFile() {
    FILE *myInputFile = fopen("input.txt", "r");
    
    // fscanf lets you read from files RATHER THAN from stdin
    int a;
    int b;
    fscanf(myInputFile, "%d", &a);
    fscanf(myInputFile, "%d", &b);

    printf("a = %d\n", a);
    printf("b = %d\n", b);

    // You wouldn't be able to use scanf when you want to get input from actual files
    exit(EXIT_SUCCESS);
}

void writeToFile() {
    FILE *myOutputFile = fopen("output.txt", "w");

    fprintf(myOutputFile, "asdfasdfasdf12312312");
    
    exit(EXIT_SUCCESS);
}

int main() {
    // somethingTerribleHasHappened();
    // readingStdin();
    // readFromFile();
    writeToFile();
    return 0;
}
