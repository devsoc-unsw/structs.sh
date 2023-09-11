#include <stdio.h>
#include <stdlib.h>

int main() { setbuf(stdout, NULL);

	puts("Hello World");

	char *a = malloc(12);
	char *b = malloc(12);
	char *c = malloc(12);
	char *d = malloc(12);

	int e;
	int f;
	scanf("%d %d", &e, &f);
	scanf("%s", a);

	printf("Hello, %d, %d", e, f);

	fgets(b, 12, stdin);

	char g = getchar();
	printf("Hello again");
	e = 1;
}