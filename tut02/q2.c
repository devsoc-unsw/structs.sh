#include <stdio.h>
#include <assert.h>
#include <time.h>

double power(double base, int exponent) {
   double result = 1;
   for (; exponent>0; exponent--) {
      result = result * base;
   }
   return result;
}

// ====================================

unsigned long int counter = 0;

int fib(int n) {
   assert(n > 0);
   counter++;

   // Base condition:
   if (n == 1 || n == 2) {
      return 1;
   } else {
      // Recursive step:
      return fib(n - 1) + fib(n - 2);
   }
}

int main() {
   // Proof that it works. Here's the first 10 fibonacci numbers
   // for (int i = 1; i < 10; i++) {
   //    printf("%d\n", fib(i));
   // }

   // 7th fibonacci number
   // printf("%d\n", fib(7));
   // printf("I looped %d times\n", counter);

   // How does this algorithm do for larger n?
   FILE *timingData = fopen("fib-timing", "w");
   for (int i = 1; i < 50; i++) {
      clock_t start = clock();
      printf("-------------------------------------\n");
      printf("Fib(%d) = %d\n", i, fib(i));
      printf("---> Computing Fib(%d) needed %d loops!\n", i, counter);

      printf("---> 1.618^(%ld) = %lf\n", i, power(1.618, i));
      // 1.618... is the golden ratio
      // This fib algorithm has a time complexity of O(1.618 ^ n)      

      clock_t end = clock();
      double timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
      printf("---> Time taken: %lf seconds\n\n", timeTaken);
      fprintf(timingData, "%lf\n", timeTaken);
      counter = 0;
   }
   fclose(timingData);

   return 0;
}


