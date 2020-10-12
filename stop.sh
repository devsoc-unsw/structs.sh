#!/bin/sh

kill -9 $(ps -ef | grep 'terminal-menu' | tr -s ' ' | cut -d ' ' -f 2)
