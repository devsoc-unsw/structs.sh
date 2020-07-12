#ifndef HASHTABLE
#define HASHTABLE

struct HashNode {
    char *zid;
    char *name;
};
typedef struct HashNode *Item;

typedef char *Key;

struct HashTableRep {
    // Array of HashNode pointers
    Item *items;    
    int numItems;
    int numSlots;
};

typedef struct HashTableRep *HashTable; 

Item newItem(char *zid, char *name);

HashTable newHashTable(int size);
int hash(Key key, int size);
void insert(HashTable hashTable, Item newItem);
void printHashTable(HashTable hashTable);
// Item get(HashTable hashTable, Item key);
// void delete(HashTable hashTable, Item key);
// void dropHashTable(HashTable hashTable);

#endif