#include <stdio.h>
#include <stdlib.h>


typedef struct _node {
   int data;
   struct _node *next;
} Node;

typedef Node *List;


// Iterative version
int lengthIter(List L) {
   int size = 0;
   List curr = L;
   while (curr != NULL) {
      size++;
      curr = curr->next;
   }
   return size;
}

// Recursive version
int lengthRecur(List L) {
   if (L == NULL) {
      return 0;
   }
   return 1 + lengthRecur(L -> next);
}
// return (L == NULL) ? 0 : 1 + lengthRecur(L -> next);

List createNode(int n, List nextNode) {
   List newNode = malloc(sizeof(Node));
   newNode->data = n;
   newNode->next = nextNode;
   return newNode;
}

void printList(List L) {
   while (L != NULL) {
      printf("%d -> ", L -> data);
      L = L -> next;
   }
   printf("X\n");
}

int main() {
   List firstHead = createNode(12, NULL);
   firstHead = createNode(24, firstHead);
   firstHead = createNode(36, firstHead);
   printf("List 1: ");
   printList(firstHead);

   List secondHead = createNode(3, NULL);
   secondHead = createNode(8, secondHead);
   secondHead = createNode(42, secondHead);
   secondHead = createNode(54, secondHead);
   secondHead = createNode(23, secondHead);
   printf("List 2: ");
   printList(secondHead);
   printf("\n");

   // First list:
   int size = lengthIter(firstHead);
   printf("lengthIter: %d\n", size);

   size = lengthRecur(firstHead);
   printf("lengthRecur: %d\n", size);

   // Second list:
   size = lengthIter(secondHead);
   printf("lengthIter: %d\n", size);

   size = lengthRecur(secondHead);
   printf("lengthRecur: %d\n", size);

   return 0;
}
