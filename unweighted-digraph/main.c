#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include "graph.h"
#include "graph-algos.h"
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
            printHorizontalRule();
        }
    } else if (strcmp(commandName, "matrix") == 0) {
		// Format: matrix
        if (numArgs != 1) {
            printInvalidCommand("Matrix command format: matrix\n");
        } else {
			showGraph(g, ADJACENCY_MATRIX);
        }
    } else if (strcmp(commandName, "list") == 0) {
		// Format: list
        if (numArgs != 1) {
            printInvalidCommand("List command format: list\n");
        } else {
			showGraph(g, ADJACENCY_LIST);
        }
    } else if (strcmp(commandName, "insert") == 0) {
		// Format: insert <v1>-<v2>
        if (numArgs < 2) {
            printInvalidCommand("Insert command format: insert <v1>-<v2>\n");
        } else {
            for (int i = 1; i < numArgs; i++) {
                char *currPair = malloc(sizeof(char) * (strlen(tokens[i]) + 1));
                strcpy(currPair, tokens[i]);
                int *vertexPairs = tokeniseEdges(currPair, g -> nV);
                int vertexCount = countVertices(currPair);
                if (!vertexPairs) break;
                for (int j = 0; j < (vertexCount - 1) * 2; j += 2) {
                    Edge edge = makeEdge(g, vertexPairs[j], vertexPairs[j + 1]);
                    printf(" ➤ Inserting edge: %d - %d\n", vertexPairs[j], vertexPairs[j + 1]);
                    insertE(g, edge);
                }
                free(vertexPairs);
            }
            showGraph(g, ADJACENCY_MATRIX);
        }
    } else if (strcmp(commandName, "remove") == 0) {
        // Format: remove <v1>-<v2>
        if (numArgs < 2) {
            printInvalidCommand("Remove command format: remove <v1>-<v2>\n");
        } else {
            for (int i = 1; i < numArgs; i++) {
                char *currPair = malloc(sizeof(char) * (strlen(tokens[i]) + 1));
                strcpy(currPair, tokens[i]);
                int *vertexPairs = tokeniseEdges(currPair, g -> nV);
                int vertexCount = countVertices(currPair);
                if (!vertexPairs) break;
                for (int j = 0; j < (vertexCount - 1) * 2; j += 2) {
                    Edge edge = makeEdge(g, vertexPairs[j], vertexPairs[j + 1]);
                    printf(" ➤ Removing edge: %d - %d\n", vertexPairs[j], vertexPairs[j + 1]);
                    removeE(g, edge);
                }
                free(vertexPairs);
            }
            showGraph(g, ADJACENCY_MATRIX);
        }
    } else if (strcmp(commandName, "dfs") == 0) {
		// Format: dfs <vertex>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("dfs command format: dfs <vertex>\n");
        } else {
            int vertex = atoi(tokens[1]);
			dfs(g, vertex);
        }
    } else if (strcmp(commandName, "bfs") == 0) {
		// Format: bfs <vertex>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("BFS command format: bfs <vertex>\n");
        } else {
            int startingVertex = atoi(tokens[1]);
			bfs(g, startingVertex);
        }
    } else if (strcmp(commandName, "cycle") == 0) {
		// Format: cycle
        if (numArgs != 1) {
            printInvalidCommand("Cycle command format: cycle\n");
        } else {
			printf(
				hasCycle(g) ? 
				" ➤ A cycle exists in the graph!\n" : 
				" ➤ No cycle exists in the graph!\n"
			);
        }
    } else if (strcmp(commandName, "path") == 0) {
		// Format: path <v1> <v2>
        if (numArgs != 3 || !isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
            printInvalidCommand("Path command format: path <v1> <v2>\n");
        } else {
            int v1 = atoi(tokens[1]);
            int v2 = atoi(tokens[2]);
			if (isReachable(g, v1, v2)) {
				printf(" ➤ A path exists between %d and %d\n", v1, v2);
			} else {
				printf(" ➤ No path exists between %d and %d\n", v1, v2);
			}
        }
    } else if (strcmp(commandName, "connected") == 0) {
		// Format: connected
        if (numArgs != 1) {
            printInvalidCommand("Connected command format: connected\n");
        } else {
			showConnectedComponents(g);
        }
    } else if (strcmp(commandName, "hamilton") == 0) {
		// Format: hamilton <v1> <v2>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Hamilton command format: hamilton <v1> <v2>\n");
        } else {
            int v1 = atoi(tokens[1]);
            int v2 = atoi(tokens[2]);
			if (hasHamiltonPath(g, v1, v2)) {
				printf(" ➤ Hamiltonian path exists between %d and %d\n", v1, v2);
			} else {
				printf(" ➤ No Hamiltonian path exists between %d and %d\n", v1, v2);
			}
        }
    } else if (strcmp(commandName, "closure") == 0) {
		// Format: closure
        if (numArgs != 1) {
            printInvalidCommand("Closure command format: closure\n");
        } else {
			transitiveClosure(g);
        }
    } else if (strcmp(commandName, "randomise") == 0) {
		// Format: randomise dense|sparse
        if (numArgs != 2) {
            printInvalidCommand("Randomise command format: randomise dense|sparse\n");
        } else {
            int numVertices = g -> nV;
            if (strcmp(tokens[1], "dense") == 0) {
                printf(" ➤ Initialising dense graph\n");
                dropGraph(g);
                g = newRandomGraph(numVertices, 2);
                showGraph(g, ADJACENCY_MATRIX);
            } else if (strcmp(tokens[1], "sparse") == 0) {
                printf(" ➤ Initialising sparse graph\n");
                dropGraph(g);
                g = newRandomGraph(numVertices, 5);
                showGraph(g, ADJACENCY_MATRIX);
            } else {
                printInvalidCommand("Randomise command format: randomise dense|sparse\n");
            }
        }
    } else if (strcmp(commandName, "clear") == 0) {
		// Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Clear command format: clear\n");
        } else {
            int numVertices = g -> nV;
			dropGraph(g);
            g = newGraph(numVertices);
            printf(" ➤ Cleared graph\n");
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
				fprintf(stderr, "Invalid edge (%d, %d)\n", v1, v2);
			else
				insertE(graph, makeEdge(graph,v1,v2));
		}
		fclose(in);
	}

	printCommands();
    printHorizontalRule();
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
