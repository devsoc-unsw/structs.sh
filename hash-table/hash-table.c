#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "hash-table.h"

Key getKey(Item item) {
    return item -> zid;
}

bool equals(Key firstKey, Key secondKey) {
    return (strcmp(firstKey, secondKey) == 0);
}

int hash(Key key, int size) {



    return 1;
}

Item newItem(char *zid, char *name) {
    Item newElem = malloc(sizeof(struct HashNode));
    char *newZid = malloc(sizeof(char) * (strlen(zid) + 1));
    char *newName = malloc(sizeof(char) * (strlen(name) + 1));
    strcpy(newZid, zid);
    strcpy(newName, name);
    newElem -> zid = newZid;
    newElem -> name = newName;
    return newElem;
}

HashTable newHashTable(int size) {
    HashTable hashTable = malloc(sizeof(struct HashTableRep));
    hashTable -> items = malloc(sizeof(Item *) * size);
    hashTable -> numItems = 0;
    hashTable -> numSlots = size;
    for (int i = 0; i < size; i++) hashTable -> items[i] = NULL;
    return hashTable;
}

void insert(HashTable hashTable, Item newItem) {
    if (hashTable -> numItems >= hashTable -> numSlots) {
        printf("Hash table is full, can't probe for available slots to insert\n");
        return;
    }
    // Get the key of the new item so that we can generate an index into the hash table
    Key key = getKey(newItem);
    int hashIndex = hash(getKey(newItem), hashTable -> numSlots);
    // Linear probing until an available position
    for (int i = 0; i < hashTable -> numSlots; i++) {
        // Empty position found
        if (hashTable -> items[hashIndex] == NULL) break;
        if (equals(key, getKey(hashTable -> items[hashIndex]))) {
            printf("Item with key %s has already been inserted\n", key);
            return;
        }
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    hashTable -> items[hashIndex] = newItem;
    hashTable -> numItems++;
    printf("Inserted %s - %s into index %d of the hash table\n", newItem -> zid, newItem -> name, hashIndex);
}

void printHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[i];
        if (curr != NULL) {
            printf("%3d. %s - %s\n", i, curr -> zid, curr -> name);
        } else {
            printf("%3d. ___\n", i);
        }
    }
}

// Item get(HashTable hashTable, Key key) {
//     int hashIndex = hash(key, hashTable -> numSlots);
//     Item items = hashTable -> items[hashIndex];
//     if (items != NULL && equal(*items, key)) {
//         return items;
//     } else {
//         return NULL;
//     }
// }

// void delete(HashTable hashTable, Key key) {
//     int h = hash(key, key);

//     Item *items = hashTable -> items[h];
//     if (items != NULL && equal(*items, key)) {
//         free(items);
//         hashTable -> items[h] = NULL;
//         hashTable -> numItems--;
//     }
// }

// void dropHashTable(HashTable hashTable) {
//     for (int i = 0; i < hashTable -> numSlots; i++) {
//         if (hashTable -> items[i] != NULL) {
//             free(hashTable -> items[i]);
//         } 
//     }
//     free(hashTable);
// }
