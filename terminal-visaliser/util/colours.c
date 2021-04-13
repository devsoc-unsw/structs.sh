#include <stdio.h>
#include "colours.h"

/**
 * Prints text in green.
 */
void printSuccess(char *text) {
    printf("\033[1;32m");
    printf("%s", text);
    printf("\033[0m");
}

/**
 * Prints text in red.
 */
void printFailure(char *text) {
    printf("\033[0;31m");
    printf("%s", text);
    printf("\033[0m");
}

/**
 * Prints text in blue.
 */
void printPrimary(char *text) {
    printf("\033[0;34m");
    printf("%s", text);
    printf("\033[0m");
}

/**
 * Prints text in magenta/violet.
 */
void printSecondary(char *text) {
    printf("\033[0;35m");
    printf("%s", text);
    printf("\033[0m");
}

/**
 * Prints text in yellow.
 */
void printWarning(char *text) {
    printf("\033[0;33m");
    printf("%s", text);
    printf("\033[0m");
}

