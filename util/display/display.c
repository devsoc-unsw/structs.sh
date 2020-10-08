#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <ctype.h>
#include <stdarg.h>
#include "display.h"
#include "../utilities/processing.h"

// Transform string to lowercase
#define lowercase(str) for (int i = 0; str[i]; i++) { str[i] = tolower(str[i]); }

void printHeader(char *header, ...) {
    va_list args;
    va_start(args, header);

    // Fetching the terminal instance's dimensions
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    int width = w.ws_col, height = w.ws_row; 
    int headerStartPos = ((width - strlen(header)) / 2) - 2;
    int headerEndPos = headerStartPos + strlen(header) + 4;

    // Set green ANSI colour code
    printf("\033[1;32m");

    for (int currPos = 0; currPos <= width; currPos++) {
        if (currPos == 0) {
            printf("%s", HEADER_BORDER_LEFT);
        } else if (currPos == width) {
            printf("%s", HEADER_BORDER_RIGHT);  
        } else if (currPos >= headerStartPos && currPos <= headerEndPos) {
            printf("%s ", HEADER_BORDER_RIGHT);
            vprintf(header, args);
            printf(" %s", HEADER_BORDER_LEFT);
            currPos += headerEndPos - headerStartPos;
        } else {
            printf("═");
        }
    }
    // Reset colouration
    printf("\033[0m");
    printf("\n");
    va_end(args);
}

void printHorizontalRule() {
    // Fetching the terminal instance's dimensions
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    int width = w.ws_col, height = w.ws_row; 
    for (int currPos = 0; currPos < width; currPos++) {
        printf("%s", BORDER_UNIT);
    }
}

void printPrompt(char *promptPreMessage) {
    printColoured("yellow", "%s ➤ ", promptPreMessage);
}


void printColoured(char *colour, char *formattedMessage, ...) {
    va_list args;
    va_start(args, formattedMessage);

    // Set ANSI colour code
    if (strcmp(colour, GREEN) == 0) {
        printf("\033[1;32m");
    } else if (strcmp(colour, BLUE) == 0) {
        printf("\033[1;34m");
    } else if (strcmp(colour, RED) == 0) {
        printf("\033[1;31m");
    } else if (strcmp(colour, YELLOW) == 0) {
        printf("\033[1;33m");
    } else if (strcmp(colour, PURPLE) == 0) {
        printf("\033[1;35m");
    } else if (strcmp(colour, CYAN) == 0) {
        printf("\033[1;36m");
    } 
    
    // Print the formatted string
    vprintf(formattedMessage, args);

    // Reset colouration
    printf("\033[0m");

    va_end(args);
}

void printInvalidCommand(char *formattedMessage, ...) {
    va_list args;
    va_start(args, formattedMessage);

    // Set red text
    printf("\033[0;31m");
    
    // Print the formatted string
    vprintf(formattedMessage, args);

    // Reset colouration
    printf("\033[0m");

    va_end(args);
}

void printCommands() {
    printHeader(COMMANDS_HEADER);
    char *commandsFilePath = getDirOfCurrExecutable();
    commandsFilePath = strcat(commandsFilePath, COMMANDS_FILE);
    FILE *commandsFile = fopen(commandsFilePath, "r");
    if (commandsFile == NULL) {
        fprintf(stderr, "Commands file is missing\n");
        printf("FAILED\n");
        exit(EXIT_FAILURE);
    }
    char commandStr[MAX_LINE];
    while(fgets(commandStr, MAX_LINE, commandsFile)) {
        printColoured("blue", " ➤ %s", commandStr);
    }
    free(commandsFilePath);
    printf("\n");
}

int getTermWidth() {
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    return w.ws_col; 
}
