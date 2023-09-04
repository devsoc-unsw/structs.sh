struct node {
  int data;
  struct node *next;
};

typedef struct list {
  struct node *head;
  int size;
} List;