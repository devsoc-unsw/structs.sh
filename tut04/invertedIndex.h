// COMP2521 Assignment 1

#ifndef _INVERTEDINDEX_GUARD
#define _INVERTEDINDEX_GUARD

// Linked list (part 1):
struct FileListNode {
	char *filename;
	double tf; // relative tf
	struct FileListNode *next;
};
typedef struct FileListNode *FileList;

// Binary search tree node definition:
struct InvertedIndexNode {
	char *word;
	struct FileListNode *fileList;   // the head of a linked list
	struct InvertedIndexNode *left;
	struct InvertedIndexNode *right;
};
typedef struct InvertedIndexNode *InvertedIndexBST;

// Linked list (for part 2):
struct TfIdfNode {
	char *filename;
	double tfIdfSum; // tfidf sum value
	struct TfIdfNode *next;
};
typedef struct TfIdfNode *TfIdfList;




// Functions for Part 1

/**
 * Normalises a given string. See the spec for details. Note: you should
 * modify the given string - do not create a copy of it.
 */
char *normaliseWord(char *str);

/**
 * This function opens the collection file with the given name, and then
 * generates an inverted index from those files listed in the collection
 * file,  as  discussed  in  the spec. It returns the generated inverted
 * index.
 */
InvertedIndexBST generateInvertedIndex(char *collectionFilename);

/**
 * Outputs  the  given inverted index to a file named invertedIndex.txt.
 * The output should contain one line per word, with the  words  ordered
 * alphabetically  in ascending order. Each list of filenames for a word
 * should be ordered alphabetically in ascending order.
*/
void printInvertedIndex(InvertedIndexBST tree); 







// Functions for Part-2

/**
 * Returns  an  ordered list where each node contains a filename and the 
 * corresponding tf-idf value for a given searchWord. You only  need  to
 * include documents (files) that contain the given searchWord. The list
 * must  be  in  descending order of tf-idf value. If there are multiple
 * files with same tf-idf, order them by  their  filename  in  ascending
 * order. D is the total number of documents in the collection.
 */
TfIdfList calculateTfIdf(InvertedIndexBST tree, char *searchWord, int D);

/**
 * Returns  an  ordered list where each node contains a filename and the
 * summation of tf-idf values of all the matching search words for  that
 * file.  You only need to include documents (files) that contain one or
 * more of the given search words. The list must be in descending  order
 * of summation of tf-idf values (tfIdfSum). If there are multiple files
 * with  the  same tf-idf sum, order them by their filename in ascending
 * order. D is the total number of documents in the collection.
 */
TfIdfList retrieve(InvertedIndexBST tree, char *searchWords[], int D);

#endif

