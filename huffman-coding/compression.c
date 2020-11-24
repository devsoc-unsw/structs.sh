#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "../hash-table/hash-table.h"
#include "compression.h"

#define FORK -1


/**
 * Given a text body, returns an array of nodes containing 
 */
HashTable computeCharFrequencies(char *textBody) {
    // Only supporting the 128 ASCII characters
    HashTable frequencyDict = newHashTable(128);   
    int textLen = strlen(textBody);
    for (int i = 0; i < textLen; i++) {
        textBody[i]; 
    }

}

HuffmanTree huffman(char *textBody) {
    // Calculating the frequencies of ASCII characters in textBody


    return NULL;
}
