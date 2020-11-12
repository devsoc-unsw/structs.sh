#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>
#include "hash-table.h"
#include "../util/display/display.h"

#define DELETED (uintptr_t) 0xFFFFFFFFFFFFFFFFUL

// Key and Item operations

Key getKey(Item item) {
    return item -> zid;
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

bool equals(Key firstKey, Key secondKey) {
    return (strcmp(firstKey, secondKey) == 0);
}

void showItem(Item item) {
    printf("\"%s\" — \"%s\"\n", item -> zid, item -> name);
}

void freeItem(Item item) {
    if (item != NULL) {
        free(item -> zid);
        free(item -> name);
        free(item);
    }
}

// Hash table operations

int hash(Key key, int size) {
    int h = 0;
    int a = 127;
    for (char *c = key; *c != '\0'; c++) {
        h = (a * h + *c) % size;
    }
    return h;
}

HashTable newHashTable(int size) {
    HashTable hashTable = malloc(sizeof(struct HashTableRep));
    hashTable -> items = malloc(sizeof(Item *) * size);
    hashTable -> numItems = 0;
    hashTable -> numSlots = size;
    for (int i = 0; i < size; i++) hashTable -> items[i] = NULL;
    return hashTable;
}

void insertIntoHashTable(HashTable hashTable, Item newItem) {
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
            printColoured("red", " ➤ Item with key %s has already been inserted\n", key);
            return;
        }
        printColoured("cyan", " ➤ Index %d is taken. Probing for the next available index\n", hashIndex);
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    hashTable -> items[hashIndex] = newItem;
    hashTable -> numItems++;
    printColoured("green", " ➤ Inserted \"%s\" at index %d\n", newItem -> name, hashIndex);
}

void printHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[i];
        printColoured("green", "%3d. ", i);
        if (curr == NULL) {
            printColoured("cyan", "___\n");
        } else if (curr == DELETED) {
            printColoured("red", "DELETED\n");
        } else {
            showItem(curr);
        }
    }
}

Item get(HashTable hashTable, Key key) {
    int hashIndex = hash(key, hashTable -> numSlots);
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[hashIndex];
        // When NULL is reached, the item doesn't exist in the hash table
        if (curr == NULL) break;
        if (curr != DELETED && equals(getKey(curr), key)) return curr;
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    return NULL;
}

void deleteFromHashTable(HashTable hashTable, Key key) {
    int hashIndex = hash(key, hashTable -> numSlots);
    Item curr = NULL;
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[hashIndex];
        // Target item doesn't exist in the hash table
        if (curr == NULL) {
            printColoured("red", " ➤ Item with key \"%s\" doesn't exist\n", key);  
            return;
        }
        if (equals(key, getKey(curr))) break;
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    freeItem(curr);
    hashTable -> items[hashIndex] = DELETED;
    hashTable -> numItems--;
    printColoured("cyan", " ➤ Deleted item with key \"%s\" from the hash table\n", key);  
}

void dropHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[i];
        if (curr != NULL && curr != DELETED) {
            freeItem(curr);
        } 
    }
    free(hashTable);
}
