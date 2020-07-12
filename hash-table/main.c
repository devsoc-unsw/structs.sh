#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "hash-table.h"
#include "../util/colours.h"

#define MAX_LINE 127

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
	char *helpLog = "|===== Commands =====|\n"
                    " ===>  help                 - show available commands\n"
                    " ===>  show                 - shows the hash table\n"
                    " ===>  insert               - inserts a new element into the hash table\n"
                    " ===>  exit                 - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

/**
 * Prints prompt for the next line of user input
 */
void printPrompt() {
	printSuccess("\n ===> Enter Command: ");
}

/**
 * Given the graph and the command string, extracts arguments from the command
 * and calls the relevant function.
 */
void processCommand(HashTable hashTable, char *command) {
    if (strcmp(command, "help") == 0) { 
        printCommands();
    } else if (strcmp(command, "show") == 0) {
        printf("Showing the hash table\n");  
        printHashTable(hashTable);
    } else if (strcmp(command, "insert") == 0) {
        char *newZid = strtok(NULL, " ");  
        char *newName = strtok(NULL, "\"");  
        insert(hashTable, newItem(newZid, newName)); 
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
    }
}

int main(int argc, char *argv[]) {
	char line[MAX_LINE];
	printCommands();
    HashTable hashTable = newHashTable(10);
	while (1) {
		printPrompt();
		fgets(line, MAX_LINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        processCommand(hashTable, line);
    }
	return 0;
}
