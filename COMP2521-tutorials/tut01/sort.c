void bubbleSort(int *a, int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        for (int j = lo; j < hi - 1; j++) {
            if (a[j] > a[j + 1]) {
                swap(a, j, j + 1);
            }
        }
    }
}
