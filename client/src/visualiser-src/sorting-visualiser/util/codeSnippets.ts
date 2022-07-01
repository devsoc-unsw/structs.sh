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

export const insertionCodeSnippet = `void insertionSort(int a[], int lo, int hi)
{
   int i, j, val;
   for (i = lo+1; i <= hi; i++) {
      val = a[i];
      for (j = i; j > lo; j--) {
         if (!less(val,a[j-1])) break;
         a[j] = a[j-1];
      }
      a[j] = val;
   }
}
`