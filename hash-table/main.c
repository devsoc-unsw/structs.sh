#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "hash-table.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"
#include "../util/menu-interface.h"

#define DEFAULT_NUM_SLOTS 10
#define MAX_SLOTS 100

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

/**
 * Given the hash table and the command string, extracts arguments from the command
 * and calls the relevant function.
 */
HashTable processCommand(HashTable hashTable, char *command) {
	char **tokens = tokenise(command);
    char *commandName = tokens[0];
    int numArgs = getNumTokens(tokens);
    char *token = commandName;

    if (numArgs <= 0) {
    } else if (!commandName) {
        printInvalidCommand("Enter a valid command\n");
    } else if (strcmp(commandName, "help") == 0) { 
        // Format: help
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
            printCommands();
            printHorizontalRule();
        }
    } else if (strcmp(commandName, "show") == 0) {
        // Format: show
        if (numArgs != 1) {
            printInvalidCommand("Show command format: show\n");
        } else {
            printf(" ➤ Showing the hash table's array\n");  
            printHashTable(hashTable);
        }
    } else if (strcmp(commandName, "hash") == 0) {
        // Format: hash <key>
        if (numArgs != 2) {
            printInvalidCommand("Hash command format: hash <key>\n");
        } else {
            char *id = tokens[1];
            int hashedVal = hash(id, hashTable -> numSlots);
            printColoured("green", " ➤ hash(\"%s\") = %d\n", id, hashedVal);
        }
    } else if (strcmp(commandName, "insert") == 0) {
        // Format: insert <key> value
        if (numArgs != 3) {
            printInvalidCommand("Insert command format: insert <key> value\n");
        } else {
            Key newID = tokens[1];
            char *newName = tokens[2];  
            int hashedVal = hash(newID, hashTable -> numSlots);
            printColoured("green", " ➤ hash(\"%s\") = %d\n", newID, hashedVal);
            insertIntoHashTable(hashTable, newItem(newID, newName)); 
        }
    } else if (strcmp(commandName, "get") == 0) {
        // Format: get <key>
        if (numArgs != 2) {
            printInvalidCommand("Get command format: get <key>\n");
        } else {
            Key targetID = tokens[1];   
            Item foundItem = get(hashTable, targetID); 
            if (foundItem != NULL) {
                printColoured("green", " ➤ Found entry: ");
                showItem(foundItem);
            } else {
                printColoured("red", " ➤ Couldn't find entry with key: \"%s\"\n", targetID);
            }
        }
    } else if (strcmp(commandName, "delete") == 0) {
        // Format: delete <key>
        if (numArgs != 2) {
            printInvalidCommand("Delete command format: delete <key>\n");
        } else {
            Key targetID = tokens[1];   
            deleteFromHashTable(hashTable, targetID); 
        }
    } else if (strcmp(commandName, "clear") == 0) {
		// Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Clear command format: clear\n");
        } else {
            int size = hashTable -> numSlots;
            dropHashTable(hashTable);
            hashTable = newHashTable(size);
        }
    } else if (strcmp(commandName, "exit") == 0) {
		// Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
			dropHashTable(hashTable);
			freeTokens(tokens);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command\n");
    }
    freeTokens(tokens);
    return hashTable;
}

int main(int argc, char *argv[]) {
    int size = DEFAULT_NUM_SLOTS;
    if (argc > 1) {
        size = atoi(argv[1]);
        if (size > MAX_SLOTS) {
            printColoured("red", "Size %d too large, sorry. Try a size below %d\n", size, MAX_SLOTS);
        }
    }

    HashTable hashTable = newHashTable(size);
    printCommands();
    printHorizontalRule();
	char line[MAX_LINE];
	while (1) {
        printPrompt("Enter command");
		fgets(line, MAX_LINE, stdin);
		// Ignore processing empty strings
        if (notEmpty(line)) {
            hashTable = processCommand(hashTable, line);
        }
    }
    dropHashTable(hashTable);
	return 0;
}
