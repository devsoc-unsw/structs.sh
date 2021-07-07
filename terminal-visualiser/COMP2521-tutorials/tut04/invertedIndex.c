#include <stdio.h>
#include <string.h>
#include "invertedIndex.h"

#include MAX_LENGTH 100

// Helper functions



// Main functions:
 
char *normaliseWord(char *str) {
    removeSpaces(str);
    convertLowercase(str);
    stripPunctuation(str);
    return str;
}

InvertedIndexBST generateInvertedIndex(char *collectionFilename) {

}


void printInvertedIndex(InvertedIndexBST tree) {
   
}

TfIdfList calculateTfIdf(InvertedIndexBST tree, char *searchWord, int D) {

}

TfIdfList retrieve(InvertedIndexBST tree, char *searchWords[], int D) {
    
}
