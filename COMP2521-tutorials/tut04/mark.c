// z5308624

// libraries
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// header files
#include "invertedIndex.h"

// define constants
#define MAX_STRING_LENGTH 100

// // Helper functions
//     // remove spaces
// char removeSpaces (char currentString) {
//     return currentString;
// }
//     // convert to lowercase
//     // stripping punctuation



// // Part 1 

// // Function for obtaining strings from the files in collection.txt
//     // Take each string from collection.txt and read and write the string.txt 
//     // reads strings from collection.txt
// char* obtainString (void) {
//     FILE* ptrCollection = fopen("exmp1/collection.txt", "r");
    
//     // saves current file name
//     char currentFile[MAX_STRING_LENGTH];
    
//     // loop through collection to record file names as currentFile 
//     while (fscanf(ptrCollection, "%s", currentFile) != EOF) {
        
//         // setup the opening of text files obtained from the collection.txt
//         FILE *ptrFiles = fopen(currentFile, "r");
        
//         // sentinal for when fscanf has read all the strings in the file1
//         char currentString[MAX_STRING_LENGTH];
        
//         // loop through each string in the text file called currentFile
//             while (fscanf(ptrFiles, "%s", currentString) != EOF) {
                
//                 return currentString;
//             }    
//     }
    
// }

// // function used for main function
// char *normaliseWord(char *str) {

//     // Normalises the input string

// }

void getFiles(char *collectionFile) {
    FILE *collection = fopen(collectionFile, "r");

    char *currentLine = malloc(sizeof(char) * 256);
    while (fgets(currentLine, 256, collection)) {
        printf("%s", currentLine);
        char *token = malloc(sizeof(char) * 256);
        sscanf(currentLine, "%s", token);
        printf("==> %s", token);
    }

}

int main(void) {
    // obtainString();
    getFiles("exmp1/collection.txt");
}