#include <float.h>
#include <limits.h>
#include <stdbool.h> // Include for _Bool type
#include <stddef.h>  // Include for ptrdiff_t
#include <stdint.h>
#include <stdio.h>

struct train {
  int carriage;
  struct train *nextCarriage;
};

typedef struct station {
  struct train *firstTrain;
} Station;

void initAndPrintMaxValues(int n) {
  if (n == 0) {
    return; // Base case: stop recursion when n reaches 0
  }

  // Initialize variables for each C type with their maximum values
  struct train my_train = {.carriage = 34, .nextCarriage = NULL};
  struct train my_train_2 = {.carriage = 89, .nextCarriage = NULL};
  my_train.nextCarriage = &my_train_2;
  struct train *my_train_ptr = &my_train;
  Station my_station = {.firstTrain = my_train_ptr};
  char my_char = CHAR_MAX;
  signed char my_signed_char = SCHAR_MAX;
  unsigned char my_unsigned_char = UCHAR_MAX;
  int my_int = INT_MAX;
  signed int my_signed_int = INT_MAX;
  long my_long = LONG_MAX;
  signed long my_signed_long = LONG_MAX;
  long long my_long_long = LLONG_MAX;
  signed long long my_signed_long_long = LLONG_MAX;
  unsigned long long my_unsigned_long_long = ULLONG_MAX;
  float my_float = FLT_MAX;
  double my_double = DBL_MAX;
  long double my_long_double = LDBL_MAX;
  _Bool my_bool = true;
  bool my_bool_2 = true;
  size_t my_size_t = SIZE_MAX;
  ptrdiff_t my_ptrdiff_t = PTRDIFF_MAX;
  short my_short = SHRT_MAX;
  unsigned short my_unsigned_short = USHRT_MAX;
  unsigned int my_unsigned_int = UINT_MAX;
  unsigned long my_unsigned_long = ULONG_MAX;
  short int my_short_int = SHRT_MAX;
  wchar_t my_wchar_t = WCHAR_MAX; // Wide character

  // Print the maximum values
  printf("Iteration %d:\n", n);
  printf("my_char: %d\n", my_char);
  printf("my_signed_char: %d\n", my_signed_char);
  printf("my_unsigned_char: %u\n", my_unsigned_char);
  printf("my_int: %d\n", my_int);
  printf("my_signed_int: %d\n", my_signed_int);
  printf("my_long: %ld\n", my_long);
  printf("my_signed_long: %ld\n", my_signed_long);
  printf("my_long_long: %lld\n", my_long_long);
  printf("my_signed_long_long: %lld\n", my_signed_long_long);
  printf("my_unsigned_long_long: %llu\n", my_unsigned_long_long);
  printf("my_float: %f\n", my_float);
  printf("my_double: %lf\n", my_double);
  printf("my_long_double: %Lf\n", my_long_double);
  printf("my_bool: %d\n", my_bool);
  printf("my_size_t: %lu\n", my_size_t);
  printf("my_ptrdiff_t: %ld\n", my_ptrdiff_t);
  printf("my_short: %d\n", my_short);
  printf("my_unsigned_short: %u\n", my_unsigned_short);
  printf("my_unsigned_int: %u\n", my_unsigned_int);
  printf("my_unsigned_long: %lu\n", my_unsigned_long);
  printf("my_short_int: %d\n", my_short_int);
  printf("my_wchar_t: %d\n", my_wchar_t);
  printf("my_train.carriage: %d", my_train.carriage);
  printf("my_train.nextCarriage: %p", my_train.nextCarriage);
  printf("my_station.train: %p\n", my_station.firstTrain);

  // Recursively call the function with n-1
  initAndPrintMaxValues(n - 1);
}

int main() {
  int n = 5; // Change this value to control the number of iterations
  initAndPrintMaxValues(n);
  return 0;
}
