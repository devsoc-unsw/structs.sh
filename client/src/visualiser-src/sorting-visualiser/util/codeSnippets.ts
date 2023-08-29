export const bubbleCodeSnippet = `void bubble_sort(int arr[], int arr_size) {
    for (int i = 0; i < arr_size - 1; i++) {
        int num_swaps = 0;
        for (int j = 0; j < arr_size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                num_swaps++;
            }
        }
        if (num_swaps == 0) 
            break;
    }
}`;

export const mergeCodeSnippet = `void merge_sort(int arr[], int low, int high, int tmp[]) {
    if (high <= low) {
        return;
    }
    int mid = (low + high) / 2;
    
    merge_sort(arr, low, mid, tmp);
    merge_sort(arr, mid + 1, high, tmp);

    int left = low, right = mid+1, k = 0;
    // scan both segments, copying to tmp
    while (left <= mid && right <= high) {
        if (arr[left] < arr[right])
            tmp[k++] = arr[left++];
        else
            tmp[k++] = arr[right++];
    }
    // copy items from unfinished segment
    while (left <= mid) tmp[k++] = arr[left++];
    while (right <= high) tmp[k++] = arr[right++];

    //copy tmp back to main array
    for (left = low, k = 0; left <= high; left++, k++)
        arr[left] = tmp[k];
}`;

export const insertionCodeSnippet = `void insertionSort(int a[], int arr_size)
{
    for (int i = 1; i < arr_size; i++) {
        int val = a[i];
        for (int j = i; j > 0; j--) {
            if (val >= a[j-1]))
                break;
            swap(a[j], a[j-1]);
        }
    }
}
`;

export const selectionCodeSnippet = `void selection_sort(int arr[], int arr_size) {
    for (int i = 0; i < arr_size - 1; i++) {
        int min_index = i;
        for (int j = i + 1; j < arr_size; j++) {
            if (arr[j] < arr[min_index])
                min_index = j;
        }
        swap(&arr[min_index], &arr[i]);
    }
}`;

export const bogoCodeSnippet = `void bogo_sort(int arr[], int arr_size) {
    while (!is_sorted(arr, arr_size)) {
        shuffle(arr, arr_size);
    }
}
bool is_sorted(int arr[], int arr_size) {
    for (int i = 0; i < arr_size - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}
void shuffle(int arr[], int arr_size) {
    for (int i = 0; i < arr_size - 1; i++) {
        swap(&arr[i], &arr[rand() % arr_size]);
    }
}`;

export const quickCodeSnippet = `void quicksort(int a[], int lo, int hi)
{
   int i; // index of pivot
   if (hi <= lo) return;
   i = partition(a, lo, hi);
   quicksort(a, lo, i-1);
   quicksort(a, i+1, hi);
}
int partition(int a[], int lo, int hi)
{
   int v = a[lo];  // pivot
   int  i = lo+1, j = hi;
   for (;;) {
      while (a[i] <= v && i < j) i++;
      while (v < a[j] && j > i) j--;
      if (i == j) break;
      swap(a,i,j);
   }
   j = a[i] < v ? i : i-1;
   swap(a,lo,j);
   return j;
}`;
