#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include "Graph.h"
#include "graph-algos.h"
#include "../util/colours.h"

#define MAXLINE 100

void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

void printCommands() {
	int i;
	char *helps[] = {
		"  =>  (m)atrix representation",
		"  =>  (l)ist representation",
		"  =>  (r)emove edge             ... r v w",
		"  =>  (i)nsert edge             ... i v w",
		"  =>  (d)epth first search      ... d v",
		"  =>  (b)readth first search    ... d v",
		"  =>  (c)ycle exists?",
		"  =>  (t) REACHABLE?            ... t v w",
		"  =>  (C)onnected components",
		"  =>  (h)amiltonian path exists ... h v w",
		"  =>  (q)uit",
		NULL,
	};
	printSuccess("|===== Commands =====|\n");
	for (i = 0; helps[i] != NULL; i++) {
		printPrimary(helps[i]);
		printf("\n");
	}
	printSuccess("|====================|\n");
}

void printPrompt() {
	printSuccess("\n ===> Enter Command: ");
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
	printPrompt();
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


