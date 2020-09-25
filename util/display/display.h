#ifndef DISPLAY
#define DISPLAY

/**
 * Prints a message prompting the user for a command.
 */
void printPrompt(char *promptPreMessage);

/**
 * Prints a full-width header on the current terminal instance
 * with a central header text.
 */
void printHeader(char *header);

/**
 * Prints a formatted string, like printf. First argument specifies
 * the colour.
 * Supported colours: green, blue, red, yellow, purple
 */
void printColoured(char *colour, char *message, ...);

/**
 * Prints a formatted string, like printf. Clearly indicates the user misuse
 * of a command.
 */
void printInvalidCommand(char *formattedMessage, ...);

#endif
