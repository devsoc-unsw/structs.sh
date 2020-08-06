// testGetPeaks.h - testing DLList data type
// Written by Ashesh Mahidadia, August 2017

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "DLList.h"
#include "getPeaks.h"


int main(int argc, char *argv[])
{
	DLList L = getDLList(stdin);
	fprintf(stdout, "Input sequence: ");
	putDLList(stdout, L);

	DLList AnsL = getPeaks(L);
	int validList = validDLList(AnsL);
	if( ! validList ) {
		fprintf(stderr, ">>> Error: Invalid list returned from the function getPeaks! \n");
		return 1;
	}

	fprintf(stdout, "Peaks: ");
	putDLList(stdout, AnsL);

	return 0;
}
