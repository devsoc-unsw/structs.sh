
// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i++) {
        printf("Hello world\n");
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i += 2) {
        printf("Hello world\n");
    }
}

// What's the time-complexity?
// Answer: O(n)
int someFunction(int n) {
    for (int i = 0; i < n; i += 2) {
        printf("Hello world\n"); 
    }
    for (int i = 0; i < n; i += 2) {
        printf("Hello world\n");
    }
    for (int i = 0; i < n; i += 2) {
        printf("Hello world\n");
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i++) {
        printf("Hello world\n");
    }
    for (int i = 0; i < n; i++) {
        printf("Hello world\n");
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                printf("Hello world\n");
            }
        }
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < 100000000000000000000000000000000; i++) {
        printf("Hello world\n");
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i *= 2) {
        printf("Hello world\n");
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j *= 2) {
            printf("Hello world\n");
        }
    }
}

// What's the time-complexity?
// Answer: 
int someFunction(int n) {
    if (n == 1) return 1;
    return n * someFunction(n - 1);
}



