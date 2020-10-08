#ifndef DISPLAY
#define DISPLAY

// Commands file default name
#define COMMANDS_FILE       "commands.txt"
#define COMMANDS_HEADER     "Commands"

// Header border characters:
#define HEADER_BORDER_LEFT  "╠"
#define HEADER_BORDER_RIGHT "╣"

// For horizontal rules
#define BORDER_UNIT         "━"

// Box edge characters. See https://en.wikipedia.org/wiki/Box-drawing_character
#define BOX_EDGE_CHAR_VERTICAL     "┃"
#define BOX_EDGE_CHAR_HORIZONTAL   "━"
#define BOX_EDGE_CHAR_TOP_LEFT     "┏"
#define BOX_EDGE_CHAR_TOP_RIGHT    "┓"
#define BOX_EDGE_CHAR_BOTTOM_LEFT  "┗"
#define BOX_EDGE_CHAR_BOTTOM_RIGHT "┛"

// String buffer character limit
#define MAX_LINE 256

// Colours
#define GREEN   "green"
#define BLUE    "blue"
#define PURPLE  "purple"
#define RED     "red"
#define YELLOW  "yellow"
#define CYAN    "cyan"

/**
 * Prints a message prompting the user for a command.
 */
void printPrompt(char *promptPreMessage);

/**
 * Prints a full-width header on the current terminal instance
 * with a central header text.
 */
void printHeader(char *header, ...);

/**
 * Prints a full-width horizontal border on the current terminal instance.
 */
void printHorizontalRule();

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

/**
 * Prints the contents of commands.txt in the currently executing process'
 * directory
 */
void printCommands();

/**
 * Get the width of the current terminal instance (in characters)
 */
int getTermWidth();

#endif
