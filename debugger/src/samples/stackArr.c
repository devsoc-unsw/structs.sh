// Program to take 5 values from the user and store them in an array
// Print the elements stored in the array

#include <stdio.h>
#define ARR_SIZE_1 5
#define ARR_SIZE_2 10

int main() {

  int values[ARR_SIZE_1];

  int arr2[ARR_SIZE_2];
  
  int arr3[ARR_SIZE_2];


  for(int i = 0; i < 5; ++i) {
    values[i] = i * i;
  }

  for(int i = 0; i < 10; ++i) {
    arr2[i] = 21;
  }


  printf("Displaying integers: ");

  // printing elements of an array
  for(int i = 0; i < 5; ++i) {
     printf("%d\n", values[i]);
  }
  return 0;
}