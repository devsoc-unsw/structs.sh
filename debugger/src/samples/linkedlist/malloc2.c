struct node {
  int data;
  struct node *next;
};

typedef struct list {
  struct node *head;
  int size;
} List;


int main(int argc, char **argv) {
    int *arr = malloc(100 * sizeof(int));
}