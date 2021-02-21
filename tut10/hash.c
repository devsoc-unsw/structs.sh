#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// This hash function tells us WHICH INDEX in the hash table to look at
// N is the size of the hash table
int hash(char *key, int N) {
	int hashValue = 0;

    for (int i = 0; i <= strlen(key); i++) {
        char currChar = key[i];
        hashValue += currChar;    // This adds the ASCII value of currChar
    }

    // This keeps the hash output value within the array bounds:
	return hashValue % N;    
}



int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: ./hash <key> <N>\n");
        return 1;
    }
    char *key = argv[1];
    int N = atoi(argv[2]);
    int hashIndex = hash(key, N);
    printf("hash(\"%s\", %d) = %d\n", key, N, hashIndex);
    return 0;
}
