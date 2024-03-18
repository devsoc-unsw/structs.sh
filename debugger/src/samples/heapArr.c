#include <stdio.h>
#include <stdlib.h>

#define ARRAY_SIZE 5

int main() {
    int size1 = ARRAY_SIZE;
    int size2 = ARRAY_SIZE;
    int size3 = ARRAY_SIZE;

    // Dynamically allocate memory for the first array
    int *array1 = (int *)malloc(size1 * sizeof(int));

    // Check if memory allocation was successful
    if (array1 == NULL) {
        printf("Memory allocation failed for the first array.\n");
        return 1; // Return an error code
    }

    // Initialize the first array elements (for demonstration)
    for (int i = 0; i < size1; i++) {
        array1[i] = i + 1;
    }

    // Dynamically allocate memory for the second array (array of chars)
    char *array2 = (char *)malloc(size2 * sizeof(char));

    // Check if memory allocation was successful
    if (array2 == NULL) {
        printf("Memory allocation failed for the second array.\n");

        // Release memory allocated for the first array before returning
        free(array1);
        return 1; // Return an error code
    }

    // Initialize the second array elements (for demonstration)
    for (int i = 0; i < size2; i++) {
        array2[i] = 'A' + i; // Assign characters 'A', 'B', 'C', ...
    }

    // Dynamically allocate memory for the third array (array of floats)
    float *array3 = (float *)malloc(size3 * sizeof(float));

    // Check if memory allocation was successful
    if (array3 == NULL) {
        printf("Memory allocation failed for the third array.\n");

        // Release memory allocated for the first and second arrays before returning
        free(array1);
        free(array2);
        return 1; // Return an error code
    }

    // Initialize the third array elements (for demonstration)
    for (int i = 0; i < size3; i++) {
        array3[i] = 0.5 * (i + 1); // Assign floats 0.5, 1.0, 1.5, ...
    }

    // Access and manipulate the arrays as needed

    // Display the contents of the arrays
    printf("Contents of the first array:\n");
    for (int i = 0; i < size1; i++) {
        printf("%d ", array1[i]);
    }
    printf("\n");

    printf("Contents of the second array:\n");
    for (int i = 0; i < size2; i++) {
        printf("%c ", array2[i]);
    }
    printf("\n");

    printf("Contents of the third array:\n");
    for (int i = 0; i < size3; i++) {
        printf("%.2f ", array3[i]);
    }
    printf("\n");

    // Don't forget to free the allocated memory when done
    free(array1);
    free(array2);
    free(array3);

    return 0; // Return 0 to indicate successful execution
}
