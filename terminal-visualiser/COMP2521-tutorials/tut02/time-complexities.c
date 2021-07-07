
// Assume that printf is a constant time operation, so O(1)

// Q1. What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i++) { 
        printf("Hello world\n");      
    }
}

// Q2. What's the time-complexity?
// Answer:
int someFunction(int n) {
    for (int i = 0; i < n; i += 2) {
        printf("Hello world\n");      
    }
}

// Q3. What's the time-complexity?
// Answer:
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

// Q4. What's the time-complexity?
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

// Q5. What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < 10000000000000000000000000000000; i++) {
        printf("Hello world\n");  
    }
}

// Q6. What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 1; i < n; i = i * 2) {
        printf("Hello world\n");
    }
}

// Q7. What's the time-complexity?
// Answer: 
int someFunction(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j *= 2) {
            for (int k = 0; k < n; k *= 2) {
                printf("Hello world\n"); 
            }
        }
    }
}

// Q8. What's the time-complexity?
// Answer: 
int someFunction(int n) {
    if (n == 1) return 1;
    return n * someFunction(n - 1);
}




