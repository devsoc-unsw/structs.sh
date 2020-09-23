#!/bin/sh
# Starts the GoTTY server. See https://github.com/yudai/gotty 

sh make_recurse.sh terminal-menu > /dev/null
gotty -w --title-format "Data Structures & Algorithms" ../terminal-menu/bin/menu
