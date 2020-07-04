#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include "Graph.h"
#include "graph-algos.h"
#include "../util/colours.h"

#define MAXLINE 100

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
		insertE(g, makeEdge(g, v1, v2));
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
	char line[MAXLINE];
	Vertex v1, v2;

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
		fgets(line,MAXLINE,in);
		sscanf(line,"%d",&N);
		graph = newGraph(N);
		// rest of lines contain edges
		while (fgets(line,MAXLINE,in) != NULL) {
			if (sscanf(line,"%d %d",&v1,&v2) != 2)
				fprintf(stderr,"Bad edge (%d,%d)\n",v1,v2);
			else
				insertE(graph, makeEdge(graph,v1,v2));
		}
		fclose(in);
	}

	// read and execute commands
	printCommands();
	while (1) {
		printPrompt();
		fgets(line, MAXLINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        graph = processCommand(graph, line);
    }


	while (fgets(line, MAXLINE, stdin) != NULL) {
		switch (line[0]) {
		case 'm':
			show(graph, ADJACENCY_MATRIX);
			break;
		case 'l':
			show(graph, ADJACENCY_LIST);
			break;
		case 'i':
			if (sscanf(line,"i %d %d", &v1, &v2) != 2)
				printf("Usage: i v1 v2\n");
			else 
				insertE(graph,makeEdge(graph, v1, v2));
				printf("Added edge %d-%d", v1, v2);
			break;
		case 'r':
			if (sscanf(line,"r %d %d",&v1,&v2) != 2)
				printf("Usage: r v1 v2\n");
			else 
				removeE(graph,makeEdge(graph, v1, v2));
				printf("Removed edge %d-%d", v1, v2);
			break;
		case 'd':
			if (sscanf(line,"d %d",&v1) != 1)
				printf("Usage: d v\n");
			else
				printPrimary("|===== Iterative DFS =====|\n");
				DFSIterative(graph, v1);
			break;
		case 'b':
			if (sscanf(line,"b %d",&v1) != 1)
				printf("Usage: b v\n");
			else
				bfs(graph, v1);
			break;
		case 'c':
			if (hasCycle(graph)) {
				printf("A cycle exists in the graph!");
			} else {
				printf("No cycle exists in the graph!");
			}
			break;
		case 't':
			if (sscanf(line,"t %d %d",&v1,&v2) != 2){
				printf("Usage: t v1 v2\n");
			} else {
				bool reachable = isReachable(graph, v1, v2);
				if (reachable) {
					printf("Path exists from %d to %d!", v1, v2);
				} else {
					printf("Path DOES NOT exist from %d to %d!", v1, v2);
				}
			}
			break;
		case 'C':
			showConnectedComponents(graph);
			break;
		case 'h':
			if (sscanf(line,"h %d %d", &v1, &v2) != 2){
				printf("Usage: h v1 v2\n");
			} else {
				if (hasHamiltonPath(graph, v1, v2)) {
					printf("Hamiltonian path exists between %d and %d\n", v1, v2);
				} else {
					printf("No Hamiltonian path exists between %d and %d\n", v1, v2);
				}
			}
			break;
		case 'q':
			return 0;
			break;
		default:
			printCommands();
			break;
		}
		printf("\n");
		printPrompt();
	}
	return 0;
}


