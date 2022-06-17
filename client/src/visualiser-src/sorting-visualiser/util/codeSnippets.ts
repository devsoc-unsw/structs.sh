export const bubbleCodeSnippet = `int i, j, nswaps;
for (i = lo; i < hi; i++) {
    for (j = hi; j > i; j--) {
        if (a[j] < a[j-1]) {
            swap(a[j], a[j-1]);
        }
    }
}`;