#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>
#include <stdbool.h>
#include <libgen.h>
#include <unistd.h>
#include "processing.h"

#define WORD_SEPARATORS " \t\r\n"
#define SPECIAL_CHARS   "!|<>"
#define MAX_LINE        256

char **tokenise(char *command) {
    size_t numTokens = 0;
    char **tokens = malloc((strlen(command) + 1) * sizeof *tokens);

    while (*command != '\0') {
        // Skip leading separators.
        command += strspn(command, WORD_SEPARATORS);
        // Skipped trailing separators
        if (*command == '\0') {
            break;
        }
        size_t tokenLen = strcspn(command, WORD_SEPARATORS);
        size_t tokenLenNoSpecials = strcspn(command, SPECIAL_CHARS);
        if (tokenLenNoSpecials == 0) {
            tokenLenNoSpecials = 1;
        }
        if (tokenLenNoSpecials < tokenLen) {
            tokenLen = tokenLenNoSpecials;
        }
        char *token = strndup(command, tokenLen);
        assert(token != NULL);
        command += tokenLen;
        tokens[numTokens] = token;
        numTokens++;
    }

    tokens[numTokens] = NULL;
    // Shrink array to correct size
    tokens = realloc(tokens, (numTokens + 1) * sizeof *tokens);
    return tokens;
}

// Free an array of strings as returned by `tokenize'.
void freeTokens(char **tokens) {
    for (int i = 0; tokens[i] != NULL; i++) {
        free(tokens[i]);
    }
    free(tokens);
}

int getNumTokens(char **tokens) {
    int numTokens = 0;
    for (char *token = tokens[numTokens]; token != NULL; numTokens++) token = tokens[numTokens];
    return (numTokens - 1 > 0) ? (numTokens - 1) : 0;
}

bool notEmpty(char *str) {
    for (int i = 0; i <= strlen(str); i++) if (isalnum(str[i])) return true;
    return false;
}

bool isNumeric(char *str) {
    for (int i = 0; i < strlen(str); i++)
        if (!isdigit(str[i])) {
            return false;
        }
    return true;
}

char *getDirOfCurrExecutable() {
    char pathToExecutable[MAX_LINE];
    readlink("/proc/self/exe", pathToExecutable, MAX_LINE);
    char *directory = dirname(pathToExecutable);
    char *result = malloc(sizeof(char) * MAX_LINE);
    strcpy(result, directory);
    strcat(result, "/");
    return result;
}

int getNumDigits(int num) {
    num = (num > 0) ? (num) : (-num);
    int digits = 0;
    while (num > 0) {
        num = num / 10;
        digits++;
    }
    return digits;
}
