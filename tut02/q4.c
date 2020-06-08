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
        return powLog(x * x, n / 2);
    } else {
        return x * powLog(x * x, n / 2);
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

    int x = 5;
    for (int j = 1; j < 100000; j += 1000) {
        printf("-------------------------------------\n");

        clock_t start = clock();
        unsigned long int iterResult = powIter(x, j);
        clock_t end = clock();
        double timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("---> Time taken powIter: %lf seconds\n", timeTaken);
        fprintf(powIterTiming, "%lf\n", timeTaken);

        start = clock();
        int recurResult = powRecur(x, j);
        end = clock();
        timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("---> Time taken powRecur: %lf seconds\n", timeTaken);
        fprintf(powRecurTiming, "%lf\n", timeTaken);

        start = clock();
        int logResult = powLog(x, j);
        end = clock();
        timeTaken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("---> Time taken powLog: %lf seconds\n", timeTaken);
        fprintf(powLogTiming, "%lf\n", timeTaken);
    }

    fclose(powIterTiming);
    fclose(powRecurTiming);
    fclose(powLogTiming);
    
    return 0;
}