export interface IFileSystem {
  initialize(): IFileDirNode;

  addFile(file: IFileFileNode): boolean;
  addDir(file: IFileDirNode): boolean;

  // return the root node so we can access all children nodes
  // when we implement the front end file selector, we could just display this return result on the FE
  getRootDirectory(): IFileDirNode;
  getFileFromPath(path: string): IFileFileNode | undefined;
  getDirFromPath(path: string): IFileDirNode | undefined;

  deleteFile(file: IFileFileNode | IFileDirNode): void;

  // Pass back root directory
  saveChanges(): void;
}

export type IFileType = 'Folder' | 'File';

export interface IFileBaseNode {
  name: string;
  path: string;
  type: 'dir' | 'file';
}

export interface IFileFileNode extends IFileBaseNode {
  data: string;
  type: 'file';
  parentPath: string;
}

export interface IFileDirNode extends IFileBaseNode {
  children: { [key: string]: IFileDirNode | IFileFileNode };
  type: 'dir';
  parentPath: string | undefined;
}

export const INITIAL_LOCAL_STORAGE_FS: IFileDirNode = {
  name: 'root',
  path: 'root',
  type: 'dir',
  parentPath: undefined,
  children: {
    '2521_Tut02': {
      name: '2521_Tut02',
      path: 'root/2521_Tut02',
      type: 'dir',
      parentPath: 'root',
      children: {
        'linked_list_delete.c': {
          name: 'linked_list_delete.c',
          path: 'root/2521_Tut02/linked_list_delete.c',
          data: `#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct node *appendNode(struct node *head, int num);
void printList(struct node *head);

/**
 * We implemented this function in class
 */
struct node *listDelete(struct node *list, int value) {
    struct node *curr = list;
    struct node *prev = NULL;
    while (curr != NULL) {
        if (curr->value == value) {
            if (prev == NULL) {
                struct node *new_head = curr->next;
                free(curr);
                return new_head;
            } else {
                prev->next = curr->next;
                free(curr);
                break;
            }
        }

        prev = curr;
        curr = curr->next;
    }
    return list;
}

int main(void) {
    struct node *linked_list = NULL;
    linked_list = appendNode(linked_list, 2);
    linked_list = appendNode(linked_list, 4);
    linked_list = appendNode(linked_list, 6);
    linked_list = appendNode(linked_list, 8);

    printList(linked_list);
    // 2 -> 4 -> 6 -> 8 -> X

    linked_list = listDelete(linked_list, 6);
    printList(linked_list);
    // 2 -> 4   ->    8 -> X

    linked_list = listDelete(linked_list, 8);
    printList(linked_list);
    // 2 -> 4   ->         X

    linked_list = listDelete(linked_list, 2);
    printList(linked_list);
    //      4   ->         X

    linked_list = listDelete(linked_list, 4);
    printList(linked_list);
    //                     X
}

/**
 * Below are helper functions for linked list
 */
struct node *createNode(int num) {
    struct node *newNode = malloc(sizeof(struct node));
    newNode->value = num;
    newNode->next = NULL;
    return newNode;
}

struct node *appendNode(struct node *head, int num) {
    struct node *newNode = createNode(num);

    if (head == NULL) {
        return newNode;
    }

    struct node *curr = head;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = newNode;
    return head;
}

void printList(struct node *head) {
    for (struct node *curr = head; curr != NULL; curr = curr->next) {
        printf("%d -> ", curr->value);
    }
    printf("X\\n");
}`,
          type: 'file',
          parentPath: '2521_Tut02',
        },
        'list_length_recursive.c': {
          name: 'list_length_recursive.c',
          path: 'root/2521_Tut02/list_length_recursive.c',
          data: `/**
 * Run:
 * $ clang 1_list_length.c linked_list.c -o 1_list_length
 * $ ./1_list_length
 */

#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct list {
    struct node *head;
};

int listLengthContainer(struct list *l);
int listLength(struct node *l);

int main() {
    struct node *list = listIntro();

    int listLengthRes = listLength(list);
    printf("Length of linked list: %d\\n", listLengthRes);

    return 0;
}

/**
 * Takes in a container struct to a linked list and returns the length of the
 * contained linked list.
 */
int listLengthContainer(struct list *l) { return listLength(l->head); }

/**
 * Recursive function to find the length of a linked list.
 */
int listLength(struct node *l) {
    if (l == NULL) {
        return 0;
    }
    return 1 + listLength(l->next);
}

/*
 * ==========================================================
 * ==================== Helper Functions ====================
 * ==========================================================
 */

void printList(struct node *l) {
    if (l == NULL) {
        printf("X\\n");
        return;
    }
    printf("%d -> ", l->value);
    printList(l->next);
}

struct node *readList(int size) {
    struct node *head = NULL;
    struct node *curr = head;

    for (int i = 0; i < size; i++) {
        int value;
        if (scanf("%d", &value) != 1) {
            break;
        }

        struct node *newNode = createNode(value);

        if (head == NULL) {
            head = newNode;
        } else {
            curr->next = newNode;
        }
        curr = newNode;
    }

    return head;
}

struct node *listIntro() {
    printf("Enter list size: ");
    int size = 0;
    if (scanf("%d", &size) == 0) {
        fprintf(stderr, "error: failed to read list size\\n");
        exit(EXIT_FAILURE);
    } else if (size < 0) {
        fprintf(stderr, "error: invalid list size\\n");
        exit(EXIT_FAILURE);
    }

    if (size > 0) {
        printf("Enter list values: ");
    }
    struct node *list = readList(size);

    printf("List: ");
    printList(list);
    printf("\\n");

    return list;
}

struct node *createNode(int val) {
    struct node *newNode = malloc(sizeof(struct node));
    if (newNode == NULL) {
        fprintf(stderr, "ERROR while creating new node due to failed malloc");
        exit(EXIT_FAILURE);
    }
    newNode->value = val;
    newNode->next = NULL;
    return newNode;
}

struct node *appendVal(struct node *head, int val) {
    struct node *newNode = malloc(sizeof(struct node));

    if (head == NULL) {
        return newNode;
    }

    struct node *curr = head;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = newNode;
    return head;
}
`,
          type: 'file',
          parentPath: 'root/2521_Tut02',
        },
      },
    },
    LinkedListWorkspace: {
      name: 'LinkedListWorkspace',
      path: 'root/LinkedListWorkspace',
      type: 'dir',
      parentPath: 'root',
      children: {
        'linked_list_helper_fns.c': {
          name: 'linked_list_helper_fns.c',
          path: 'root/LinkedListWorkspace/linked_list_helper_fns.c',
          data: `/**
 * Simple linked list program using helper functions.
 */

#include <stdio.h>
#include <stdlib.h>

// Define a node structure
struct Node {
    int data;
    struct Node *next;
};

// Function to create a new node
struct Node *createNode(int data) {
    struct Node *node = malloc(sizeof(*node));
    if (node == NULL) {
        perror("Failed to allocate memory for a new node");
        exit(EXIT_FAILURE);
    }
    node->data = data;
    node->next = NULL;
    return node;
}

// Function to insert a node at the beginning of the list
void insertAtBeginning(struct Node **head, int data) {
    struct Node *newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}

// Function to print the linked list
void printList(struct Node *head) {
    struct Node *current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node *head = NULL;  // Initialize an empty linked list

    // Insert nodes at the beginning of the list
    insertAtBeginning(&head, 3);
    insertAtBeginning(&head, 2);
    insertAtBeginning(&head, 1);

    printf("Final linked list:\\n");
    printList(head);  // Output: 1 -> 2 -> 3 -> NULL

    return 0;
}
`,
          type: 'file',
          parentPath: 'root/LinkedListWorkspace',
        },
        'reverse_linked_list_fns.c': {
          name: 'reverse_linked_list_fns.c',
          path: 'root/LinkedListWorkspace/reverse_linked_list_fns.c',
          data: `#include <stdio.h>
#include <stdlib.h>

struct node {
    char data;
    struct node* next;
};

struct list {
    struct node* head;
    struct node* tail;
};

struct node* createNode(char data) {
    struct node* newNode = malloc(sizeof(struct node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

void prependNode(struct list* list, char data) {
    if (list->head == NULL) {
        // List is empty, set list to point to new node.
        list->head = createNode(data);
        list->tail = list->head;
    } else if (list->tail == NULL) {
        // Head exists but tail does not (strange), so prepend to head.
        list->tail = list->head;
        struct node* newNode = createNode(data);
        newNode->next = list->head;
        list->head = newNode;
    } else {
        // Prepend to head.
        struct node* newNode = createNode(data);
        newNode->next = list->head;
        list->head = newNode;
    }
}

void appendNode(struct list* list, char data) {
    if (list->head == NULL) {
        // List is empty, set list to point to new node.
        list->head = createNode(data);
        list->tail = list->head;
    } else if (list->tail == NULL) {
        // Head exists but tail does not (strange), so append to head.
        list->tail = createNode(data);
        list->head->next = list->tail;
    } else {
        // Append to tail.
        list->tail->next = createNode(data);
        list->tail = list->tail->next;
    }
}

// Function to reverse the linked list
void reverseLinkedList(struct list* list) {
    if (list->head == NULL || list->tail == NULL) {
        return;
    }
    list->tail = list->head;
    struct node* prev = NULL;
    struct node* curr = list->head;
    struct node* next = NULL;
    while (curr != NULL) {
        next = curr->next;  // Store next
        curr->next = prev;  // Reverse curr node's pointer
        prev = curr;        // Move pointers one position ahead
        curr = next;
    }
    list->head = prev;
}

// Function to print the linked list
void printList(struct list* list) {
    struct node* curr = list->head;
    while (curr != NULL) {
        printf("%d ", curr->data);
        curr = curr->next;
    }
    printf("\\n");
}

int main() {
    struct list* list = malloc(sizeof(struct list));
    list->head = NULL;
    list->tail = NULL;

    // Add nodes to the list
    prependNode(list, 'l');
    prependNode(list, 'i');
    prependNode(list, 'v');
    prependNode(list, 'e');

    // Reverse the linked list
    reverseLinkedList(list);

    return 0;
}
`,
          type: 'file',
          parentPath: 'root/LinkedListWorkspace',
        },
        'reverse_linked_list_imperative.c': {
          name: 'reverse_linked_list_imperative.c',
          path: 'root/LinkedListWorkspace/reverse_linked_list_imperative.c',
          data: `#include <stdio.h>
#include <stdlib.h>

struct node {
    char data;
    struct node *next;
};

struct node *prepend(struct node *head, char num) {
    struct node *newNode = malloc(sizeof(struct node));
    newNode->data = num;
    newNode->next = head;
    return newNode;
}

int main() {
    struct node *head = NULL;

    head = prepend(head, 'e');
    head = prepend(head, 'v');
    head = prepend(head, 'i');
    head = prepend(head, 'l');

    // Reverse the linked list
    struct node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;

    // Print reversed list
    curr = head;
    while (curr != NULL) {
        printf("%d ", curr->data);
        next = curr->next;
        free(curr);
        curr = next;
    }

    return 0;
}
`,
          type: 'file',
          parentPath: 'root/LinkedListWorkspace',
        },
        'sort_linked_list.c': {
          name: 'sort_linked_list.c',
          path: 'root/LinkedListWorkspace/sort_linked_list.c',
          data: `/**
 * Sort linked list
 */
#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};

struct list {
    struct node *head;
    int size;
};

void insertion_sort(struct list *list) {
    if (!list->head || !list->head->next) {
        return;  // No need to sort if the list has 0 or 1 elements
    }

    struct node *sorted = NULL;
    struct node *curr = list->head;
    while (curr != NULL) {
        struct node *next = curr->next;
        if (!sorted || sorted->data >= curr->data) {
            curr->next = sorted;
            sorted = curr;
        } else {
            struct node *temp = sorted;
            while (temp != NULL) {
                if (temp->next == NULL || temp->next->data > curr->data) {
                    curr->next = temp->next;
                    temp->next = curr;
                    break;
                }
                temp = temp->next;
            }
        }
        curr = next;
    }
    list->head = sorted;
}

struct node *create_new_node(int data) {
    struct node *new = malloc(sizeof(struct node));
    new->data = data;
    new->next = NULL;
    return new;
}

void append(int value, struct list *list) {
    struct node *new_tail = create_new_node(value);
    if (list->head == NULL) {
        list->head = new_tail;
        return;
    }

    struct node *curr = list->head;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    curr->next = new_tail;
};

void print_list(struct list *list) {
    struct node *curr = list->head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("X\\n");
}

int main(int argc, char *argv[]) {
    struct list *list = malloc(sizeof(struct list));
    list->head = NULL;
    append(5, list);
    append(10, list);
    append(12, list);
    append(7, list);
    append(21, list);
    print_list(list);

    insertion_sort(list);
}
`,
          type: 'file',
          parentPath: 'root/LinkedListWorkspace',
        },
        'treelike_linked_list.c': {
          name: 'treelike_linked_list.c',
          path: 'root/LinkedListWorkspace/treelike_linked_list.c',
          data: `/**
 * Treelike linked list
 * Diagram: https://imgur.com/JKtOvb8
 */

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

struct node *new_node(int val);
struct list *new_list();
struct node *append(struct node *head, int val);
void print_list(struct node *list);

struct node {
    int data;
    struct node *next;
};

typedef struct list List;

int main(int argc, char **argv) {
    struct node *node1 = new_node(1);
    struct node *node2 = new_node(2);
    struct node *node3 = new_node(3);
    struct node *node4 = new_node(4);
    struct node *node5 = new_node(5);
    struct node *node6 = new_node(6);
    struct node *node7 = new_node(7);

    node1->next = node5;
    node2->next = node5;
    node3->next = node6;
    node4->next = node6;
    node5->next = node7;
    node6->next = node7;

    print_list(node1);  // 1 -> 5 -> 7 -> X
    print_list(node2);  // 2 -> 5 -> 7 -> X
    print_list(node3);  // 3 -> 6 -> 7 -> X
    print_list(node4);  // 4 -> 6 -> 7 -> X
}

// Basic list functions
struct node *new_node(int val) {
    struct node *new = malloc(sizeof(struct node));
    new->data = val;
    new->next = NULL;
    return new;
}

struct node *append(struct node *head, int val) {
    struct node *new = new_node(val);
    if (head == NULL) {
        return new;
    } else {
        struct node *curr = head;
        while (curr->next != NULL) {
            curr = curr->next;
        }
        curr->next = new;
    }
    return head;
}

void print_list(struct node *list) {
    struct node *curr = list;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("X\\n");
}
`,
          type: 'file',
          parentPath: 'root/LinkedListWorkspace',
        },
      },
    },
  },
};
