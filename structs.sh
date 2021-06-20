#!/bin/sh

helpLog="Usage: $0 [--frontend | --backend]"

while test $# -gt 0; do
    case "$1" in
        -h)
            echo "$helpLog"
            exit 0
            ;;
        --frontend)
            npm --prefix ./client run start  
            exit 0
            ;;
        --backend)
            npm --prefix ./server run dev
            exit 0
            ;;
    esac
done
