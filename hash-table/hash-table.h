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

// Key and Item operations

/**
 * Given the item, return its key identifier
 */
Key getKey(Item item);

/**
 * Initialise a new hash table entry 
 */
Item newItem(char *zid, char *name);

/**
 * Equals operator hook function
 */
bool equals(Key firstKey, Key secondKey);

/**
 * Displays the contents of the item
 */
void showItem(Item item);

// Hash table operations

/**
 * Hash function that maps a given key string to an index into the hash table.
 * Output of the hash function depends on the size of the hash table
 */
int hash(Key key, int size);

/**
 * Mallocates and initialises a new empty hash table
 */
HashTable newHashTable(int size);

/**
 * Inserts a new item into the hashtable 
 */
void insertIntoHashTable(HashTable hashTable, Item newItem);

/**
 * Prints the contents of the hash table's array
 */
void printHashTable(HashTable hashTable);

/**
 * Given the key, map the key to an index into the hash table and fetch
 * the entry that is associated with the key
 */
Item get(HashTable hashTable, Key key);

/**
 * Deletes the entry associated with the given key from the hash table
 */
void deleteFromHashTable(HashTable hashTable, Key key);

/**
 * Deallocates memory associated with the hash table
 */
void dropHashTable(HashTable hashTable);

#endif