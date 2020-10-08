#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include "Graph.h"
#include "graph-algos.h"
#include "floyd-warshall.h"
#include "../util/menu-interface.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

/**
 * Given the graph and the command string, extracts arguments from the command
 * and calls the relevant function.
 */
Graph processCommand(Graph g, char *command) {
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
        }
    } else if (strcmp(commandName, "matrix") == 0) {
		// Format: matrix
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
			show(g, ADJACENCY_MATRIX);
        }
    } else if (strcmp(commandName, "list") == 0) {
		// Format: list
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
			show(g, ADJACENCY_LIST);
        }
    } else if (strcmp(commandName, "insert") == 0) {
		// Format: insert <v1> <v2>
        if (numArgs != 3 || !isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
            printInvalidCommand("Help command format: help\n");
        } else {
            int v1 = atoi(tokens[1]);
            int v2 = atoi(tokens[2]);
			insertE(g, makeEdge(g, v1, v2));
        }
    } else if (strcmp(commandName, "remove") == 0) {
        // Format: remove <v1> <v2>
        if (numArgs != 3 || !isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
            printInvalidCommand("Help command format: help\n");
        } else {
            int v1 = atoi(tokens[1]);
            int v2 = atoi(tokens[2]);
			removeE(g, makeEdge(g, v1, v2));
        }
    } else if (strcmp(commandName, "depth") == 0) {
		// Format: depth <vertex>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Help command format: help\n");
        } else {
            int vertex = atoi(tokens[1]);
			DFSIterative(g, vertex);
        }
    } else if (strcmp(commandName, "breadth") == 0) {
		// Format: breadth <vertex>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Help command format: help\n");
        } else {
            int startingVertex = atoi(tokens[1]);
			BFS(g, startingVertex);
        }
    } else if (strcmp(commandName, "cycle") == 0) {
		// Format: hasCycle
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
			printf(
				hasCycle(g) ? 
				" ➤ A cycle exists in the graph!" : 
				" ➤ No cycle exists in the graph!"
			);
        }
    } else if (strcmp(commandName, "showConnected") == 0) {
		// Format: hasCycle
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
			showConnectedComponents(g);
        }
    } else if (strcmp(commandName, "hamilton") == 0) {
		// Format: hamilton <v1> <v2>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Help command format: help\n");
        } else {
            int v1 = atoi(tokens[1]);
            int v2 = atoi(tokens[2]);
			if (hasHamiltonPath(g, v1, v2)) {
				printf(" ➤ Hamiltonian path exists between %d and %d\n", v1, v2);
			} else {
				printf(" ➤ No Hamiltonian path exists between %d and %d\n", v1, v2);
			}
        }
    } else if (strcmp(commandName, "transitiveClosure") == 0) {
		// Format: transitiveClosure
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
			transitiveClosure(g);
        }
    } else if (strcmp(commandName, "exit") == 0) {
		// Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
			dropGraph(g);
			freeTokens(tokens);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command\n");
    }
	freeTokens(tokens);
    return g;
}

int main(int argc, char *argv[]) {
	Graph graph = NULL;
	int N = 0; 
	char *edgeFile = NULL;
	char line[MAX_LINE];
	Vertex v1 = 0;
	Vertex v2 = 0;

	if (argc < 2) printUsagePrompt(argv);
	if (isdigit(argv[1][0])) { N = atoi(argv[1]); edgeFile = NULL; }
	else { N = 0; edgeFile = argv[1]; }

	// Building the graph
	if (edgeFile == NULL)
		graph = newGraph(N);
	else {
		// read edges and insert into graph
		FILE *in;
		if ((in = fopen(edgeFile,"r")) == NULL) {
			fprintf(stderr, "Can't open edge file\n");
			printUsagePrompt(argv);
		}
		// First line in the file contains number of vertices
		fgets(line,MAX_LINE,in);
		sscanf(line,"%d",&N);
		graph = newGraph(N);
		// Rest of the lines in the file contains edges v1-v2
		while (fgets(line,MAX_LINE,in) != NULL) {
			if (sscanf(line,"%d %d",&v1,&v2) != 2)
				fprintf(stderr,"Bad edge (%d, %d)\n", v1, v2);
			else
				insertE(graph, makeEdge(graph,v1,v2));
		}
		fclose(in);
	}

	printCommands();
	while (1) {
        printPrompt("Enter command");
		fgets(line, MAX_LINE, stdin);
		// Ignore processing empty strings
        if (notEmpty(line)) {
			graph = processCommand(graph, line);
        }
    }
	dropGraph(graph);
	return 0;
}
