#include <stdio.h>

int main() {
    char ch = 'i';
    switch (ch) {
        case 'a':
            printf("eh? ");
            break;
        case 'e':
            printf("eee ");
            break;
        case 'i':
            printf("eye ");
            break;
        case 'o':
            printf("ohh ");
            break;
        case 'u':
            printf("you ");
            break;
    }
    printf("\n");
}

/*
Replace the switch-case with this and you'll have the same behaviour:
if (ch == 'a') {
    printf("eh? ");
} else if (ch == 'e') {
    printf("eee ");
} else if (ch == 'i') {
    printf("eye ");
} else if (ch == 'o') {
    printf("ohh ");
} else if (ch == 'u') {
    printf("you ");
}
printf("\n");  
*/
