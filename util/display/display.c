#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <ctype.h>
#include <stdarg.h>

#define COMMANDS_HEADER     "Linked List Commands"
#define HEADER_BORDER_LEFT  "╠"
#define HEADER_BORDER_RIGHT "╣"
#define MAX_LINE            256

#define GREEN   "green"
#define BLUE    "blue"
#define PURPLE  "purple"
#define RED     "red"
#define YELLOW  "yellow"

#define lowercase(str) for (int i = 0; str[i]; i++) { str[i] = tolower(str[i]); }

void printHeader(char *header) {
    // Fetching the terminal instance's dimensions
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    int width = w.ws_col, height = w.ws_row; 
    int headerStartPos = ((width - strlen(header)) / 2) - 2;
    int headerEndPos = headerStartPos + strlen(header) + 4;
    for (int currPos = 0; currPos <= width; currPos++) {
        if (currPos == 0) {
            printf("%s", HEADER_BORDER_LEFT);
        } else if (currPos == width) {
            printf("%s", HEADER_BORDER_RIGHT);  
        } else if (currPos >= headerStartPos && currPos <= headerEndPos) {
            printf("%s %s %s", HEADER_BORDER_RIGHT, header, HEADER_BORDER_LEFT);
            currPos += headerEndPos - headerStartPos;
        } else {
            printf("═");
        }
    }
    printf("\n");
}


void printPrompt(char *promptPreMessage) {
    printf("%s ➤ ", promptPreMessage);
}


void printColoured(char *colour, char *formattedMessage, ...) {
    va_list args;
    va_start(args, formattedMessage);

    // Set ANSI colour code
    if (strcmp(colour, GREEN) == 0) {
        printf("\033[1;32m");
    } else if (strcmp(colour, BLUE) == 0) {
        printf("\033[0;34m");
    } else if (strcmp(colour, RED) == 0) {
        printf("\033[0;31m");
    } else if (strcmp(colour, YELLOW) == 0) {
        printf("\033[0;33m");
    } else if (strcmp(colour, PURPLE) == 0) {
        printf("\033[0;35m");
    } 
    
    // Print the formatted string
    vprintf(formattedMessage, args);

    // Reset colouration
    printf("\033[0m");

    va_end(args);
}
