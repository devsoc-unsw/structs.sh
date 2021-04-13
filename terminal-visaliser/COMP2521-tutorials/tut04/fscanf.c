#include <stdio.h>
#include <stdlib.h>

int main(void) {

    FILE *myFile = fopen("example.txt", "r");
    
    char *line = malloc(sizeof(char) * 256);
    
    line = fgets(line, 256, myFile);
    printf("%s", line);


    fclose(myFile);

    return 0;
}