#ifndef HASHTABLE
#define HASHTABLE

typedef char *Item;

struct HashTableRep {
    Item **items;  // Matrix of items
    int numItems;
    int numSlots;
};

typedef struct HashTableRep *HashTable; 

HashTable newHashTable(int size);
int hash(char *key, int size);
void insert(HashTable hashTable, Item newItem);
Item *get(HashTable hashTable, Item key);
void delete(HashTable hashTable, Item key);
void dropHashTable(HashTable hashTable);

#endif