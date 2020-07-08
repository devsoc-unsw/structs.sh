#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include "Graph.h"
#include "graph-algos.h"
#include "../util/colours.h"

#define MAX_LINE 127

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
                    " ===>  matrix               - shows matrix representation\n"
                    " ===>  list                 - shows matrix representation\n"
                    " ===>  insert <v1> <v2>     - inserts edge v1 to v2\n"
                    " ===>  remove <v1> <v2>     - removes edge v1 to v2\n"
                    " ===>  depth <v1>           - performs depth first search starting on v1\n"
                    " ===>  breadth <v1>         - performs breadth first search starting on v1\n"
                    " ===>  cycle                - determines whether a cycle exists in the graph\n"
                    " ===>  showConnected        - shows all the connected subgraphs in the whole graph\n"
					" ===>  hamilton <v1> <v2>   - checks if a Hamilton path exists from v1 to v2\n"
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
Graph processCommand(Graph g, char *command) {
    if (strcmp(command, "help") == 0) { 
        printCommands();
    } else if (strcmp(command, "matrix") == 0) {
		show(g, ADJACENCY_MATRIX);
    } else if (strcmp(command, "list") == 0) {
		show(g, ADJACENCY_LIST);
    } else if (strcmp(command, "insert") == 0) {
        int v1 = atoi(strtok(NULL, " "));  
        int v2 = atoi(strtok(NULL, " "));  
        int weight = atoi(strtok(NULL, " "));  
		insertE(g, makeEdge(g, v1, v2, weight));
    } else if (strcmp(command, "remove") == 0) {
        int v1 = atoi(strtok(NULL, " "));  
        int v2 = atoi(strtok(NULL, " "));  
        int weight = atoi(strtok(NULL, " "));   // TODO: Fix makeEdge. Shouldn't require weight on deletion
		removeE(g, makeEdge(g, v1, v2, weight));
    } else if (strcmp(command, "depth") == 0) {
        int v1 = atoi(strtok(NULL, " "));  
		DFSIterative(g, v1);
    } else if (strcmp(command, "breadth") == 0) {
        int v1 = atoi(strtok(NULL, " "));  
		BFS(g, v1);
    } else if (strcmp(command, "cycle") == 0) {
		printf(hasCycle(g) ? " -> A cycle exists in the graph!" : " -> No cycle exists in the graph!");
    } else if (strcmp(command, "showConnected") == 0) {
		showConnectedComponents(g);
    } else if (strcmp(command, "hamilton") == 0) {
        int v1 = atoi(strtok(NULL, " "));  
        int v2 = atoi(strtok(NULL, " "));  
		if (hasHamiltonPath(g, v1, v2)) {
			printf(" -> Hamiltonian path exists between %d and %d\n", v1, v2);
		} else {
			printf(" -> No Hamiltonian path exists between %d and %d\n", v1, v2);
		}
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
		dropGraph(g);
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
    }
    return g;
}

int main(int argc, char *argv[]) {
	Graph graph;
	int N; 
	char *edgeFile;
	char line[MAX_LINE];

	// collect command-line params
	if (argc < 2) printUsagePrompt(argv);
	if (isdigit(argv[1][0])) { N = atoi(argv[1]); edgeFile = NULL; }
	else { N = 0; edgeFile = argv[1]; }

	// build graph
	if (edgeFile == NULL)
		graph = newGraph(N);
	else {
		// read edges and insert into graph
		FILE *in;
		if ((in = fopen(edgeFile,"r")) == NULL) {
			fprintf(stderr,"Can't open edge file\n");
			printUsagePrompt(argv);
		}
		// first line contains #vertices
		fgets(line,MAX_LINE,in);
		sscanf(line,"%d",&N);
		graph = newGraph(N);
		// rest of lines contain edges
		Vertex v1, v2;
		int weight;
		while (fgets(line,MAX_LINE,in) != NULL) {
			if (sscanf(line,"%d %d %d", &v1, &v2, &weight) != 2)
				fprintf(stderr,"Bad edge (%d, %d, %d)\n", v1, v2, weight);
			else
				insertE(graph, makeEdge(graph, v1, v2, weight));
		}
		fclose(in);
	}

	// read and execute commands
	printCommands();
	while (1) {
		printPrompt();
		fgets(line, MAX_LINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        graph = processCommand(graph, line);
    }
	return 0;
}


