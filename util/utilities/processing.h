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

/**
 * Gets the directory of the currently running executable (irrespective of
 * calling path)
 */
char *getDirOfCurrExecutable();

/**
 * Gets the number of digits in the specified number
 */
int getNumDigits(int num);

/**
 * Given a string like "1-2 3-4-5-6 7-8", returns an array of integers 
 * containing: [1, 2, 3, 4, 4, 5, 5, 6, 7, 8]
 */
int *tokeniseEdges(char *vertexPair, int numVertices)

#endif
