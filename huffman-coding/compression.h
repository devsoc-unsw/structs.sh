#ifndef COMPRESSION_H
#define COMPRESSION_H


struct encodingNode {
    char character;
    int  frequency;
};
typedef struct encodingNode HuffmanTreeNode;
typedef HuffmanTreeNode *HuffmanTree;

HashTable computeCharFrequencies();
HuffmanTree huffman(char *textBody);


#endif
