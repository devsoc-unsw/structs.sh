export const bubbleCodeSnippet = `void bubble_sort(int arr[], int arr_size) {
    for (int i = 0; i < arr_size - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < arr_size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = true;
            }
        }

        if (!swapped) {
            return;
        }
    }
}`;
