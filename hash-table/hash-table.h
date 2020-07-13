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

Key getKey(Item item);
Item newItem(char *zid, char *name);
bool equals(Key firstKey, Key secondKey);
void showItem(Item item);

int hash(Key key, int size);
HashTable newHashTable(int size);
void insert(HashTable hashTable, Item newItem);
void printHashTable(HashTable hashTable);
Item get(HashTable hashTable, Key key);
void delete(HashTable hashTable, Key key);
void dropHashTable(HashTable hashTable);

#endif