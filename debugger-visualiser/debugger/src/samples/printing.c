#include <stdio.h>
#include <stdlib.h>

void func1(int *arr, int len) {
	for (int i = 0; i < len; i++) {
		arr[i] = (arr[i]%19) * (arr[i]%7);
	}
}

int main() {
	int a = 1;
	int b = 2;

	int *arr = malloc(100 * sizeof(int));
	for (int i = 0; i < 100; i++) {
		arr[i] = i+1;
	}

	func1(arr, 100);

	puts("The array is:\n");
	for (int i = 0; i < 100; i++) {
		printf("%d\n", arr[i]);
	}
	putchar('\n');
	putchar('a');
	int c[5] = {9, 5, 7, 9, 0};
	printf("The stack array c is as [%d, %d, %d, %d, %d]\n", c[0], c[1], c[2], c[3], c[4]);
}