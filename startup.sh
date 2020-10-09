#!/bin/sh
# Starts the GoTTY server. See https://github.com/yudai/gotty 

# Recursively run makefiles for every available interactive data structure and algorithm 
sh util/scripts/make_recurse.sh .

gotty -w --title-format "Data Structures & Algorithms" ruby terminal-menu.rb

