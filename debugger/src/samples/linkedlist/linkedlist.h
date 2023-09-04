struct node *new_node(int val);
struct list *new_list();
void append(struct list *l, int val);
int remove_tail(struct list *l);
int remove_at(struct list *l, int index);
int remove_head(struct list *l);
void print_list(struct list *list);

struct node {
  int data;
  struct node *next;
};

typedef struct list {
  struct node *head;
  int size;
} List;
