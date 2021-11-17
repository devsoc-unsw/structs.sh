const sourceCode = {
  c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

// This function prints contents of linked list starting from
// the given node
void printList(struct Node* n)
{
    while (n != NULL) {
        printf(" %d ", n->data);
        n = n->next;
    }
}

int main()
{
    struct Node* head = NULL;
    struct Node* second = NULL;
    struct Node* third = NULL;

    // allocate 3 nodes in the heap
    head = (struct Node*)malloc(sizeof(struct Node));
    second = (struct Node*)malloc(sizeof(struct Node));
    third = (struct Node*)malloc(sizeof(struct Node));

    head->data = 1; // assign data in first node
    head->next = second; // Link first node with second

    second->data = 2; // assign data to second node
    second->next = third;

    third->data = 3; // assign data to third node
    third->next = NULL;

    printList(head);

    return 0;
}
`,
  cpp: `#include <iostream.h>
main() {
  cout << "Hello World!" << endl;
  return 0;
}`,
  csharp: `class HelloWorld {
 static void Main() {
  System.Console.WriteLine("Hello, World!");
 }
`,
  java: `class HelloWorld {
  static public void main( String args[] ) {
    System.out.println( "Hello World!" );
  }
}`,
  javascript: `var sys = require("sys");
sys.puts("Hello World");
`,
  python: `class Node():
    def __init__(self, val):
        self.val = val
        self.next = None

    def __repr__(self):
        return "{}".format(self.val)


class LinkedList():
    def __init__(self, init_vals):
        self.head = None
        self.tail = None
        for each_val in init_vals:
            self.append(each_val)

    def append(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

    def show(self):
        curr = self.head
        while curr:
            print(curr, end=" ")
            curr = curr.next
        print("")

`,
  typescript: `var exclamation: string = "Hello";
var noun: string = "World";
console.log(exclamation + noun);
`
};

export default sourceCode;
