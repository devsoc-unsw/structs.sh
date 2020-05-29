#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    FILE *myFile = fopen("my_dirty_secrets.txt", "r");
    char *myLine = malloc(sizeof(char) * 255);
    while (myLine = fgets(myLine, 255, myFile)) {
        printf("===> Read the line %s", myLine);
    }
    fclose(myFile);
    return 0;
}