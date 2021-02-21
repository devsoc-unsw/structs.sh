#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include <signal.h>
#include "graph.h"
#include "graph-algos.h"
#include "../util/menu-interface.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"
#include "dijkstra.h"

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
		// Format: insert <v1>-<v2> <weight>
        if (numArgs != 3 || !isNumeric(tokens[2])) {
            printInvalidCommand("Insert command format: insert <v1>-<v2> <weight>\n");
        } else {
            int weight = atoi(tokens[2]);
            char *currPair = malloc(sizeof(char) * (strlen(tokens[1]) + 1));
            strcpy(currPair, tokens[1]);
            int *vertexPairs = tokeniseEdges(currPair, g -> nV);
            if (vertexPairs) {
                Edge edge = makeEdge(g, vertexPairs[0], vertexPairs[1], weight);
                printf(" ➤ Inserting edge: %d - %d\n", vertexPairs[0], vertexPairs[1]);
                insertEdge(g, edge);
                showGraph(g, ADJACENCY_MATRIX);
            }
            free(vertexPairs);
            free(currPair);
        }
    } else if (strcmp(commandName, "remove") == 0) {
        // Format: remove <v1>-<v2>
        if (numArgs < 2) {
            printInvalidCommand("Remove command format: remove <v1>-<v2>\n");
        } else {
            char *currPair = malloc(sizeof(char) * (strlen(tokens[1]) + 1));
            strcpy(currPair, tokens[1]);
            int *vertexPairs = tokeniseEdges(currPair, g -> nV);
            if (vertexPairs) {
                Edge edge = getEdge(g, vertexPairs[0], vertexPairs[1]);
                printf(" ➤ Removing edge: %d - %d\n", vertexPairs[0], vertexPairs[1]);
                removeEdge(g, edge);
                showGraph(g, ADJACENCY_MATRIX);
            }
            free(vertexPairs);
            free(currPair);
        }
    } else if (strcmp(commandName, "degree") == 0) {
		// Format: degree <v>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("degree command format: degree <v>\n");
        } else {
            int vertex = atoi(tokens[1]);
			showDegree(g, vertex);
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
    } else if (strcmp(commandName, "dijkstra") == 0) {
		// Format: dijkstra <vertex>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Dijkstra command format: dijkstra <vertex>\n");
        } else {
            int startingVertex = atoi(tokens[1]);
			dijkstra(g, startingVertex);
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
				pathTrace(g, v1, v2);
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
        if (g -> nV > 10) {
            printf("This runs an O(n!) algorithm. This is gonna take years, sorry. Try a graph with 10 or fewer vertices\n");
        } else {
            switch (numArgs) {
                case 2:
                    if (strcmp(tokens[1], "circuit") != 0) {
                        printInvalidCommand("Hamilton command format: hamilton circuit\n");
                    } else {
                        if (!showHamiltonCircuit(g)) {
                            printColoured("red", "No Hamiltonian circuits found\n");
                        }
                    }
                    break;
                case 3:
                    if (!isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
                        printInvalidCommand("Hamilton command format: hamilton <v1> <v2>\n");
                    } else {
                        int src = atoi(tokens[1]);
                        int dest = atoi(tokens[2]);
                        if (showHamiltonPath(g, src, dest)) {
                            printColoured("green", " ➤ Hamiltonian path exists between %d and %d\n", src, dest);
                        } else {
                            printColoured("red", " ➤ No Hamiltonian path exists between %d and %d\n", src, dest);
                        }
                    }
                    break;
                default:
                    printInvalidCommand("Hamiltonian circuit command format: hamilton circuit\n");
                    printInvalidCommand("Hamiltonian path command format: hamilton <v1> <v2>\n");
            }
        }
    } else if (strcmp(commandName, "euler") == 0) {
		// Format: Euler <v1> <v2>
        if (g -> nV > 10) {
            printf("This runs an O(n!) algorithm. This is gonna take years, sorry. Try a graph with 10 or fewer vertices\n");
        } else {
            switch (numArgs) {
                case 2:
                    if (strcmp(tokens[1], "circuit") != 0) {
                        printInvalidCommand("Euler command format: euler circuit\n");
                    } else {
                        if (!showEulerCircuit(g)) {
                            printColoured("red", "No Eulerian circuits found\n");
                        }
                    }
                    break;
                case 3:
                    if (!isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
                        printInvalidCommand("Euler command format: euler <v1> <v2>\n");
                    } else {
                        int src = atoi(tokens[1]);
                        int dest = atoi(tokens[2]);
                        if (showEulerPath(g, src, dest)) {
                            printColoured("green", " ➤ Eulerian path exists between %d and %d\n", src, dest);
                        } else {
                            printColoured("red", " ➤ No Eulerian path exists between %d and %d\n", src, dest);
                        }
                    }
                    break;
                default:
                    printInvalidCommand("Euler circuit command format: euler circuit\n");
                    printInvalidCommand("Euler path command format: euler <v1> <v2>\n");
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
		// Format: randomise <density> <max weight>
        if (numArgs != 3 || !isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
            printInvalidCommand("Randomise command format: randomise <density> <max weight>\n");
        } else {
            int numVertices = g -> nV;
            int density = atoi(tokens[1]);
            int maxWeight = atoi(tokens[2]);
            if (density < 0 || density > 100) {
                printInvalidCommand("density factor must be between 0 and 100\n");
            } else {
                printf(" ➤ Initialising randomised graph\n");
                dropGraph(g);
                g = newRandomGraph(numVertices, density, maxWeight);
                showGraph(g, ADJACENCY_MATRIX);
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

static void interruptHandler(int placeholder) {
    printf("Killing connection. Bye!\n");
    exit(1);
}

int main(int argc, char *argv[]) {
    signal(SIGINT, interruptHandler);
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
            int weight;
			if (sscanf(line,"%d %d %d", &v1, &v2, &weight) != 3)
				fprintf(stderr, "Invalid edge (%d, %d, weight=%d)\n", v1, v2, weight);
			else
				insertEdge(graph, makeEdge(graph, v1, v2, weight));
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
