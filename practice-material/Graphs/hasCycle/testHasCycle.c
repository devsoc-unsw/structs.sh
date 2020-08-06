
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

bool hasCycle(Graph g);

int main(void) {
	Graph g = GraphRead();
	GraphDump(g, stdout);
	
	bool result = hasCycle(g);
	printf("hasCycle returned: %s\n",
	       result ? "TRUE" : "FALSE");
	
	GraphFree(g);
}

