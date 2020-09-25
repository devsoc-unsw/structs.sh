#include <stdio.h>
#include <stdlib.h>

#define WORD_SEPARATORS " \t\r\n"
#define SPECIAL_CHARS "!|<>"

static char **tokenise(char *s) {
    size_t numTokens = 0;
    char **tokens = malloc((strlen(s) + 1) * sizeof *tokens);

    while (*s != '\0') {
        // Skip leading separators.
        s += strspn(s, WORD_SEPARATORS);
        // Skipped trailing separators
        if (*s == '\0') {
            break;
        }
        size_t tokenLen = strcspn(s, WORD_SEPARATORS);
        size_t tokenLenNoSpecials = strcspn(s, SPECIAL_CHARS);
        if (tokenLenNoSpecials == 0) {
            tokenLenNoSpecials = 1;
        }
        if (tokenLenNoSpecials < tokenLen) {
            tokenLen = tokenLenNoSpecials;
        }
        char *token = strndup(s, tokenLen);
        assert(token != NULL);
        s += tokenLen;
        tokens[numTokens] = token;
        numTokens++;
    }

    tokens[numTokens] = NULL;
    // Shrink array to correct size
    tokens = realloc(tokens, (numTokens + 1) * sizeof *tokens);
    return tokens;
}

// Free an array of strings as returned by `tokenize'.
static void freeTokens(char **tokens) {
    for (int i = 0; tokens[i] != NULL; i++) {
        free(tokens[i]);
    }
    free(tokens);
}
