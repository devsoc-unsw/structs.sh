/**
 * Test C program for testing debugger's function definition parser.
 * See debugger/parse_functions.py
 *
 */

#include <stdbool.h>

typedef struct node {
  int data;
  struct node *next;
} Node;

// Simple function declarations
void fn21(){};
char fn22(int aaa){};
int fn23(int aaa, int bbb){};
long fn24(long _39, long ___400){};
short fn25(short _58fhd, short FJD__902){};

// Function declarations with multi-word types
char fn3(int a, long b, long long c, unsigned long d, unsigned long long e){};
short fn4(unsigned short a, signed char b, unsigned char c, unsigned int d,
          signed int e, unsigned long f, signed long g, unsigned long long h,
          signed long long i){};
long long fn31(long long a, long long b){};
unsigned long fn32(unsigned long a, unsigned long b){};
unsigned long long fn33(unsigned long long a, unsigned long long b){};
unsigned short fn34(unsigned short a, unsigned short b){};
signed char fn35(signed char a, signed char b){};
signed int fn36(signed int a, signed int b){};
signed long fn37(signed long a, signed long b){};
signed long long fn38(signed long long a, signed long long b){};
unsigned char fn39(unsigned char a, unsigned char b){};
unsigned int fn40(unsigned int a, unsigned int b){};

// Function declarations with structs
struct node fn8(void *arg1, char arg2[], struct node arg3){};
struct node *fn13(void *arg1, char arg2[], struct node *arg3){};
Node fn10(void *arg1, char arg2[], Node arg3){};
Node *fn9(void *arg1, char arg2[], Node *arg3){};

// Function declarations with pointers
int *fn2(int *a, int *b){};
void fn6(void *a){};
void *fn12(int arg1, char *arg2, int *arg3){};
void *fn16(long arg1, long long arg2, long long *arg3){};
void *fn11(int *arg1, int *arg2, int *arg3){};

// Function declarations with arrays
int fn26(int DSF[], int SR71[]){};
char fn27(char JDK48fds[], char fjs__8934[10]){};
float fn28(float JDK48fds[], float fjs__8934[10]){};
double fn29(double JDK48fds[], double fjs__8934[10]){};
long long fn30(long long aB_c123[], long long _456D__e[10]){};
unsigned long long fn50(unsigned long long aB_c123[],
                        unsigned long long _456D__e[10]){};

// Imported type bool
bool fn41(){};
bool fn42(bool a, bool b, int c){};
bool *fn43(bool *a, bool b){};

// Not a function declaration
int main(void) { return 0; }

/**
 * Other test cases:
 * - functions and whitespace
 * - nested pointer types
 * - nested array types
 *
 */