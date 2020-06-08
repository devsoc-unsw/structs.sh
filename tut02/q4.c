#include <time.h>
#include <stdio.h>

int powIter(int x, unsigned int n) {
   int result = 1;
    for (int i = 0; i < n; i++) {
        result *= x;
    }
   return result;
}

int powRecur(int x, unsigned int n) {
    if (n == 0) {
        return 1;
    }
    return x * powRecur(x, n - 1); 
}

int powLog(int x, unsigned int n) {
    if (n == 0) {
        return 1;
    } else if (n == 1) {
        return x;
    }

    if (n % 2 == 0) {
        return powLog(x, n / 2) * powLog(x, n / 2);
    } else {
        return powLog(x, n / 2) * powLog(x, (n / 2) + 1);
    }
}

int main() {
    // Demonstration
    // for (int i = 3; i < 8; i++) {
    //     for (int j = 2; j < 8; j++) {
    //         printf("powIter:  %d^%d = %d\n", i, j, powIter(i, j));
    //         printf("powRecur: %d^%d = %d\n", i, j, powRecur(i, j));
    //         printf("powLog:   %d^%d = %d\n", i, j, powLog(i, j));
    //     }
    // }

    // Saving the timing results for graphing
    FILE *powIterTiming = fopen("pow-iter-timing", "w");
    FILE *powRecurTiming = fopen("pow-recur-timing", "w");
    FILE *powLogTiming = fopen("pow-log-timing", "w");

    for (int i = 10; i < 20; i++) {
        for (int j = 10; j < 20; j++) {
            printf("-------------------------------------\n");

            clock_t start = clock();
            int iterResult = powIter(i, j);
            clock_t end = clock();
            double timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
            printf("powIter:  %d^%d = %d\n", i, j, iterResult);
            printf("---> Time taken: %lf seconds\n\n", timeTaken);
            fprintf(powIterTiming, "%lf\n", timeTaken);

            start = clock();
            int recurResult = powRecur(i, j);
            end = clock();
            timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
            printf("powRecur: %d^%d = %d\n", i, j, recurResult);
            printf("---> Time taken: %lf seconds\n\n", timeTaken);
            fprintf(powRecurTiming, "%lf\n", timeTaken);

            start = clock();
            int logResult = powLog(i, j);
            end = clock();
            timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
            printf("powLog:   %d^%d = %d\n", i, j, logResult);
            printf("---> Time taken: %lf seconds\n\n", timeTaken);
            fprintf(powLogTiming, "%lf\n", timeTaken);
        }
    }

    fclose(powIterTiming);
    fclose(powRecurTiming);
    fclose(powLogTiming);
    
    return 0;
}