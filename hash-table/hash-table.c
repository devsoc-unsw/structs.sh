#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "hash-table.h"



//
Item copy(Item item) {
    Item newItem = malloc(sizeof(char) * (strlen(item) + 1));
    strcpy(newItem, item);
    return newItem;
}

bool equal(Item firstItem, Item secondItem) {
    return (strcpy(firstItem, secondItem) == 0);
}
//

int hash(Item key, int size) {
    return strlen(key) % size;
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
    int hashIndex = hash(newItem, hashTable -> numSlots);

    hashTable -> items[hashIndex] = copy(newItem);
    hashTable -> numItems++;
}

Item *get(HashTable hashTable, Item key) {
    int hashIndex = hash(hashTable, key);
    Item *items = hashTable -> items[hashIndex];
    if (items != NULL && equal(*items, key)) {
        return items;
    } else {
        return NULL;
    }
}

void delete(HashTable hashTable, Item key) {
    int h = hash(hashTable, key);

    Item *items = hashTable -> items[h];
    if (items != NULL && equal(*items, key)) {
        free(items);
        hashTable -> items[h] = NULL;
        hashTable -> numItems--;
    }
}

void dropHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        if (hashTable -> items[i] != NULL) {
            free(hashTable -> items[i]);
        } 
    }
    free(hashTable);
}
