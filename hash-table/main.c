#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "hash-table.h"
#include "../util/colours.h"

#define MAX_LINE 127
#define DEFAULT_NUM_SLOTS 10

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
                    " ===>  help                  - show available commands\n"
                    " ===>  show                  - shows the hash table\n"
                    " ===>  insert <zID> \"name\"   - inserts a new student into the hash table\n"
                    " ===>  get <zID>             - fetches the student with the specified zID\n"
                    " ===>  delete <zID>          - deletes the student with the specified zID\n"
                    " ===>  exit                  - quit program\n"
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
        Key newZid = strtok(NULL, " ");  
        char *newName = strtok(NULL, "\"");  
        insert(hashTable, newItem(newZid, newName)); 
    } else if (strcmp(command, "get") == 0) {
        Key targetZid = strtok(NULL, " ");   
        Item foundItem = get(hashTable, targetZid); 
        if (foundItem != NULL) {
            printf("Found student: ");
            showItem(foundItem);
        } else {
            printf("Couldn't find student with zID: %s\n", targetZid);
        }
    } else if (strcmp(command, "delete") == 0) {
        Key targetZid = strtok(NULL, " ");   
        delete(hashTable, targetZid); 
        printf("Deleted item with key %s from the hash table\n", targetZid);  
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        dropHashTable(hashTable);
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
    }
}

int main(int argc, char *argv[]) {
    int size = DEFAULT_NUM_SLOTS;
    if (argc > 1) {
        size = atoi(argv[1]);
    }

	char line[MAX_LINE];
	printCommands();
    HashTable hashTable = newHashTable(size);
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
