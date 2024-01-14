
// This tests a function with no local variables
int foo(int bar) {
	return bar + 1;
}

int baz(int bar) {
	int bof = 2;
	bar += bof;
	return bar;
}

// This tests a function with no arguments
int main() {
	int a = 2;
	int b = foo(a);
	int c = baz(a);
}