#!/bin/sh
# Starts and stops the GoTTY server. See https://github.com/yudai/gotty 

if test $# -le 0; then
    echo "Usage: $0 --start|--stop"  
else
    while test $# -gt 0; do   # $# is argc
        case "$1" in
            -h|--help)
                echo "Usage: $0 --start|--stop"  
                exit 0
                ;;
            --stop)
                stop=true
                shift 
                ;;
            --start)
                stop=false
                shift
                ;;
            *)
                break
                ;;
        esac
    done

    if test $stop = true; then
        kill -9 $(ps -ef | grep 'terminal-menu' | tr -s ' ' | cut -d ' ' -f 2) 2> /dev/null
    else
    # Recursively run makefiles for every available interactive data structure and algorithm 
        sh util/scripts/make_recurse.sh .
        gotty -w --title-format "Tactile DS" ruby terminal-menu.rb
    fi
fi
