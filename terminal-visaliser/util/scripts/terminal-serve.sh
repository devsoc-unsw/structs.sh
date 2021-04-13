#!/bin/sh
# Starts the GoTTY server. See https://github.com/yudai/gotty 

# Compile the terminal-menu
make_recurse terminal-menu > /dev/null

# Compile every available interactive data structure and algorithm 
make_recurse ../../

gotty -w --config ./.gotty-config --title-format "Data Structures & Algorithms" \
    '../terminal-menu/bin/menu' -c '/home/tim/DataStructures/util/terminal-menu/.menu-options'
# TODO: NEED TO MAKE THE PATH RELATIVE, BUT LOOKS LIKE BMENU DOESN'T SUPPORT IT. WORKAROUND?
# Idea: have a config file, but write it to a file in ~/ directory

echo "done!"
