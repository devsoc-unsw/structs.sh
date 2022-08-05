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

export const insertionCodeSnippet = `void sort(int arr[], int arr_size) {
    // Loop through unsorted partition of the array
    for (int i = 1; i < arr_size; i++) {
        int j = i;

        // Keep swapping the jth element with the element below
        // Until it is in the correct position of sorted partition
        while (j > 0 && arr[j] < arr[j - 1]) {
            swap(&arr[j], &arr[j - 1]);
            j--;
        }
    }
}
`