struct node
{
    int val;
    struct node *next;
};

int main(void)
{
    struct node n1 = { .val = 1111 };
    struct node n2 = { .val = 2222 };
    n1.next = &n2;
    n2.next = &n1;

    return 0;
}
