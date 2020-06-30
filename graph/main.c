#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include "Graph.h"
#include "../util/colours.h"

#define MAXLINE 100

void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

void help() {
	int i;
	char *helps[] = {
		"  =>  (i)insert edge     ... i v w",
		"  =>  (r)emove edge      ... r v w",
		"  =>  (d)epth first      ... d v",
		"  =>  (b)readth first    ... d v",
		"  =>  (p)ath check (bfs) ... p v",
		"  =>  (P)ath check (dfs) ... p v",
		"  =>  (f)ind short path  ... f v w",
		"  =>  (c)ycle check",
		"  =>  (C)onnected components",
		"  =>  (q)uit",
		NULL,
	};
	printSuccess("|===== Commands =====|\n");
	for (i = 0; helps[i] != NULL; i++) {
		printSecondary(helps[i]);
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
		graph = newRandomGraph(N);
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
				insertE(graph, mkEdge(graph,v1,v2));
		}
		fclose(in);
	}

	// read and execute commands
	show(graph);
	printPrompt();
	while (fgets(line,MAXLINE,stdin) != NULL) {
		switch (line[0]) {
		case 'i':
			if (sscanf(line,"i %d %d",&v1,&v2) != 2)
				printf("Usage: i v1 v2\n");
			else 
				insertE(graph,mkEdge(graph,v1,v2));
			break;
		case 'r':
			if (sscanf(line,"r %d %d",&v1,&v2) != 2)
				printf("Usage: r v1 v2\n");
			else 
				removeE(graph,mkEdge(graph,v1,v2));
		case 'p':
			if (sscanf(line,"p %d %d",&v1,&v2) != 2)
				printf("Usage: p v1 v2\n");
			else if (hasPath(graph,v1,v2))
				printf("Path exists from %d to %d\n",v1,v2);
			else
				printf("No path exists from %d to %d\n",v1,v2);
			break;
		case 'P':
			if (sscanf(line,"P %d %d",&v1,&v2) != 2)
				printf("Usage: P v1 v2\n");
			else if (dfsHasPath(graph,v1,v2))
				printf("Path exists from %d to %d\n",v1,v2);
			else
				printf("No path exists from %d to %d\n",v1,v2);
			break;
		case 'f':
			if (sscanf(line,"f %d %d",&v1,&v2) != 2)
				printf("Usage: f v1 v2\n");
			else
				findPath(graph,v1,v2);
			break;
		case 'F':
			if (sscanf(line,"F %d %d",&v1,&v2) != 2)
				printf("Usage: f v1 v2\n");
			else
				dfsFindPath(graph,v1,v2);
			break;
		case 'd':
			if (sscanf(line,"d %d",&v1) != 1)
				printf("Usage: d v\n");
			else
				dfs(graph, v1);
			break;
		case 'b':
			if (sscanf(line,"b %d",&v1) != 1)
				printf("Usage: b v\n");
			else
				bfs(graph, v1);
			break;
		case 'B':
			if (sscanf(line,"B %d",&v1) != 1)
				printf("Usage: B v\n");
			else
				bfsShow(graph, v1);
			break;
		case 'c':
			if (hasCycle(graph))
				printf("Cycle\n");
			else
				printf("No cycle\n");
			break;
		case 'C':
			components(graph);
			break;
		case 'q':
			return 0;
			break;
		default:
			help();
			break;
		}
		printf("\n");
		show(graph);
		printPrompt();
	}
	return 0;
}


