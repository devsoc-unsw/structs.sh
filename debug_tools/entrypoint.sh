#!/bin/sh
set -e

GDB=/usr/bin/gdb
# Match debugger/src/debugger/base_debugger.py
GDB_MI_FLAGS="--interpreter=mi4 --quiet -nx -nh"

compile_c() {
    src="$1"
    out="${2:-${src%.c}.out}"
    gcc "$src" -o "$out" -ggdb -O0
    printf '%s\n' "$out"
}

run_gdb() {
    if [ -t 0 ]; then
        exec "$GDB" $GDB_MI_FLAGS --tty "$(tty)" "$@"
    fi
    exec "$GDB" $GDB_MI_FLAGS "$@"
}

if [ "$#" -gt 0 ]; then
    case "$1" in
        shell|sh)
            shift
            exec /bin/sh "$@"
            ;;
        *.c)
            exe=$(compile_c "$1")
            shift
            run_gdb --args "$exe" "$@"
            ;;
        *)
            if [ -f "$1" ] && [ -x "$1" ]; then
                exe="$1"
                shift
                run_gdb --args "$exe" "$@"
            elif [ -f "$1" ]; then
                echo "error: '$1' is not executable; pass a .c file or chmod +x" >&2
                exit 1
            fi
            ;;
    esac
fi

run_gdb
