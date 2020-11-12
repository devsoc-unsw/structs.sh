#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>
#include <stdbool.h>
#include <libgen.h>
#include <unistd.h>
#include "processing.h"
#include "../display/display.h"

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
        if (tokenLenNoSpecials == 0) tokenLenNoSpecials = 1;
        if (tokenLenNoSpecials < tokenLen) tokenLen = tokenLenNoSpecials;
        char *token = strndup(command, tokenLen);
        assert(token != NULL);
        command += tokenLen;
        normaliseToken(token);
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

void normaliseToken(char *token) {
    while (*token != '\0') {
        *token = tolower(*token);
        token++;
    }
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
    for (int i = 0; i < strlen(str); i++) {
        if (i == 0) {
            if (!isdigit(str[i]) && str[i] != '-')
                return false;
        } else if (!isdigit(str[i])) {
            return false;
        }
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

/**
 * Given a seed int array, an array to populate and the size of the seed array,
 * adds vertex pairs into the array to populate. Assumes it has enough allocated
 * memory
 */
static void populatePairs(int *seed, int *doubled, int size) {
    if (size <= 1) return;
    doubled[0] = seed[0];
    doubled[1] = seed[1];
    doubled += 2;
    seed++;
    populatePairs(seed, doubled, size - 1);
}

int countVertices(char *vertexPairs) {
    int length = (strlen(vertexPairs) + 1);
    char *vertexString = malloc(sizeof(char) * length);
    char *currToken = malloc(sizeof(char) * length);
    strcpy(vertexString, vertexPairs);
    strcpy(currToken, strtok(vertexString, "-"));
    int i = 0;
    while(currToken != NULL) {
        i++;
        currToken = strtok(NULL, "-");
    }
    return i;    
}

int *tokeniseEdges(char *vertexPairs, int numVertices) {
    int length = (strlen(vertexPairs) + 1);
    char *vertexString = malloc(sizeof(char) * length);
    strcpy(vertexString, vertexPairs);
    int i = 0;
    int *tokens = malloc(sizeof(int) * numVertices);
    char *currToken = malloc(sizeof(char) * length);
    strcpy(currToken, strtok(vertexString, "-"));
    while(currToken != NULL) {
        if (!isNumeric(currToken)) {
            printColoured("red", "%s is not numeric\n", currToken);
            return NULL;
        }
        tokens[i++] = atoi(currToken);
        currToken = strtok(NULL, "-");
    }    
    if (i <= 1) {
        printColoured("red", "Invalid edges\n");
        return NULL;
    }
    int *pairs = malloc(sizeof(int) * (i - 1) * 2); 
    populatePairs(tokens, pairs, i);
    return pairs;
}

