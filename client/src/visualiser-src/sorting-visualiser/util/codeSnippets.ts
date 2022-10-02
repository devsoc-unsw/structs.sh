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
    int pointer_left = low;
    int pointer_right = mid + 1;
    int k;
    
    for (k = low; k <= high; k++) {
        if (pointer_left == mid + 1) {
            tmp[k] = arr[pointer_right];
            pointer_right++;
        } else if (pointer_right == high + 1) {
            tmp[k] = arr[pointer_left];
            pointer_left++;
        } else if (arr[pointer_left] < arr[pointer_right]) {
            tmp[k] = arr[pointer_left];
            pointer_left++;
        } else {
            tmp[k] = arr[pointer_right];
            pointer_right++;
        }
    }
    for (k = low; k <= high; k++) {
        arr[k] = tmp[k];
    }
}`;
