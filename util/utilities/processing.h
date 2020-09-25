#ifndef PROCESSING_UTIL
#define PROCESSING_UTIL

#include <stdbool.h>

/**
 * Given a command string, breaks it up into tokens. Returns an
 * array of the individual tokens
 */
char **tokenise(char *command);

/**
 * Frees an array of tokens, outputted by the tokenise function
 */
void freeTokens(char **tokens);

/**
 * Given an array of tokens, returns the number of tokens
 */
int getNumTokens(char **tokens);

/**
 * Given a string, checks if it has any meaning content (eg. if alphanumeric
 * characters are present)
 */
bool notEmpty(char *str);

/**
 * Given a string, checks whether it is numeric or not
 */
bool isNumeric(char *str);

#endif
