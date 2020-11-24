#include <stdio.h>
#include "compression.h"

int main() {
    struct encodingNode node;
    node.character = 'c';
    node.frequency = 10;
    printf("%c %d\n", node.character, node.frequency);
    return 0;
}
