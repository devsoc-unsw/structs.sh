export const bubbleCodeSnippet = `int i, j, num_swaps;
for (i = 0; i < a.length; i++) {
    for (j = 1; j < a.length - i; j++) {
        if (a[j] < a[j-1]) {
            swap(&a[j], &a[j-1]);
            num_swaps++;
        }
    }
    if (num_swaps == 0) {
        return;
    }
    num_swaps = 0;
}`;
