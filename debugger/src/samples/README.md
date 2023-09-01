# Sample C programs

## Compiling

Run `make` or `make all`.

For manual compilation:

```bash
$ gcc -ggdb program.c -o program
```

## Debugging

To debug with gdb:

```bash
$ gdb <program_name> 
```

For example, if your program binary file is named `program`:

```bash
$ gdb program
```

## Removing binaries and object files

Run `make clean`.

## Creating new samples

Please follow these steps:

1. Create relevant subdirectories under this [samples](.) directory.
1. Add a new target to the [Makefile](./Makefile) so that your program can be compiled easily with `make`.
1. Add the name of the object files (e.g. `main.o`, `linkedlist.o`) and compiled binaries (e.g. `main`, `linkedlist`) to the [.gitignore](./.gitignore) to prevent accidentally committing.
