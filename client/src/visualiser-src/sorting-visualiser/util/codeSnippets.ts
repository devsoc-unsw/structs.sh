export const bubbleCodeSnippet = `int i, j, nswaps;
for (i = lo; i < hi; i++) {
    for (j = hi; j > i; j--) {
        if (a[j] < a[j-1]) {
            swap(a[j], a[j-1]);
        }
    }
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