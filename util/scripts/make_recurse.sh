#!/bin/sh
# Finds and runs all makefiles in the target directory and its subdirectories

targetDirectory=$1
makeArg=$2
makefiles=$(find $targetDirectory | egrep 'Makefile$')
cwd=$(pwd)
for makefile in $makefiles; do
    makeDir=$(echo $makefile | sed 's/\/Makefile$//g')
    echo "Running make in $makeDir"
    cd $cwd/$makeDir
    make $makeArg
done
