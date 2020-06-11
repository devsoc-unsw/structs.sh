#include <stdio.h>
#include <assert.h>
#include <time.h>

unsigned long counter = 0;

unsigned long fib(int n) {
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
   for (int i = 1; i < 10; i++) {
      printf("%d\n", fib(i));
   }



   // 5th fibonacci number
   // printf("fib(5) = %d\n", fib(5));
   // printf("I looped %d times\n", counter);




   // How does this algorithm do for larger n?
   // FILE *timingData = fopen("fib-timing", "w");
   // for (int i = 1; i < 50; i++) {
   //    clock_t start = clock();
   //    printf("-------------------------------------\n");
   //    printf("Fib(%d) = %lu\n", i, fib(i));
   //    printf("---> Computing Fib(%d) needed %lu loops!\n", i, counter);
   //    clock_t end = clock();
   //    double timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
   //    printf("---> Time taken: %lf seconds\n\n", timeTaken);
   //    fprintf(timingData, "%lf\n", timeTaken);
   //    counter = 0;
   // }
   // fclose(timingData);

   return 0;
}


