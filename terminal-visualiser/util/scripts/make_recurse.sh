#!/bin/sh
# Finds and runs all makefiles in the target directory and its subdirectories
# Usage: ./make_recurse <target directory> [make options]  

targetDirectory=$1
makeArg=$2
makefiles=$(find $targetDirectory | egrep 'Makefile$')
cwd=$(pwd)
for makefile in $makefiles; do
    makeDir=$(echo $makefile | sed 's/\/Makefile$//g')
    echo "Running 'make $makeArg' in: $makeDir"
    cd $cwd/$makeDir
    if make $makeArg > /dev/null 2> /dev/null; then
        echo " → Succeeded"
    else 
        echo " → Failed"
    fi
done
