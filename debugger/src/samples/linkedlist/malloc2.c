struct node {
  int data;
  struct node *next;
};

typedef struct list {
  struct node *head;
  int size;
} List;


int main(int argc, char **argv) {
    struct node *node3 = malloc(sizeof(struct node));
}