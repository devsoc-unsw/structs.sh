#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>
#include "hash-table.h"
#include "../util/colours.h"

#define DELETED (uintptr_t) 0xFFFFFFFFFFFFFFFFUL

// =====

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
    printf("%s — %s\n", item -> zid, item -> name);
}

void freeItem(Item item) {
    if (item != NULL) {
        free(item -> zid);
        free(item -> name);
        free(item);
    }
}

// =====

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

/**
 * 
 */
void insert(HashTable hashTable, Item newItem) {
    if (hashTable -> numItems >= hashTable -> numSlots) {
        printf("Hash table is full, can't probe for available slots to insert\n");
        return;
    }
    // Get the key of the new item so that we can generate an index into the hash table
    Key key = getKey(newItem);
    int hashIndex = hash(getKey(newItem), hashTable -> numSlots);
    printf("Calculated hash value: hash(\"%s\", %d) = %d\n", newItem -> zid, hashTable -> numSlots, hashIndex);
    // Linear probing until an available position
    for (int i = 0; i < hashTable -> numSlots; i++) {
        // Empty position found
        if (hashTable -> items[hashIndex] == NULL) break;
        if (equals(key, getKey(hashTable -> items[hashIndex]))) {
            printf("Item with key %s has already been inserted\n", key);
            return;
        }
        printf(" ⟶ Index %d is taken. Probing for the next available index\n", hashIndex);
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    hashTable -> items[hashIndex] = newItem;
    hashTable -> numItems++;
    printf("Inserted %s - %s into index %d of the hash table\n", newItem -> zid, newItem -> name, hashIndex);
}

/**
 * 
 */
void printHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[i];
        printf("%3d. ", i);
        if (curr == NULL) {
            printSecondary("NO ITEM\n");
        } else if (curr == DELETED) {
            printFailure("DELETED\n");
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

void delete(HashTable hashTable, Key key) {
    int hashIndex = hash(key, hashTable -> numSlots);
    Item curr = NULL;
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[hashIndex];
        // Target item doesn't exist in the hash table
        if (curr == NULL) return;
        if (equals(key, getKey(curr))) break;
        hashIndex = (hashIndex + 1) % hashTable -> numSlots;
    }
    freeItem(curr);
    hashTable -> items[hashIndex] = DELETED;
    hashTable -> numItems--;
}

void dropHashTable(HashTable hashTable) {
    for (int i = 0; i < hashTable -> numSlots; i++) {
        Item curr = hashTable -> items[i];
        if (curr != NULL) {
            freeItem(curr);
        } 
    }
    free(hashTable);
}
