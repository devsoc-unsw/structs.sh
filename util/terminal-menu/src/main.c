// Copyright (c) 2017 Brian Barto
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 3 of the License, or (at your option)
// any later version.  See LICENSE for more details.

#include <stdio.h>
#include <unistd.h>
#include <termios.h>
#include <string.h>
#include <stdlib.h>
#include "menu.h"


#define NAME_EXTENSION     "(source code: github.com/Tymotex/DataStructures)"
#define INITIAL_PROMPT     "Press any key to start!"

#define KEY_ENTER   10          // enter key
#define KEY_ESC     27          // escape char indicating an arrow key
#define KEY_DOWN    66          // down-arrow key
#define KEY_UP      65          // up-arrow key
#define KEY_LEFT    68          // left-arrow key
#define KEY_RIGHT   67          // right-arrow key
#define KEY_H       104         // h key
#define KEY_J       106         // j key
#define KEY_K       107         // k key
#define KEY_L       108         // l key
#define KEY_W       119         // w key
#define KEY_A       97          // a key
#define KEY_S       115         // s key
#define KEY_D       100         // d key

int waitForUser(void) {
	int ch;
	struct termios oldt, newt;
	
	tcgetattr ( STDIN_FILENO, &oldt );
	newt = oldt;
	newt.c_lflag &= ~( ICANON | ECHO );
	tcsetattr ( STDIN_FILENO, TCSANOW, &newt );
	ch = getchar();
	tcsetattr ( STDIN_FILENO, TCSANOW, &oldt );
	
	return ch;
}

void clearScreen() {
	const char *CLEAR_SCREEN_ANSI = "\e[1;1H\e[2J";
	write(STDOUT_FILENO, CLEAR_SCREEN_ANSI, 10);
}

/***************************************************
 * Main function
 ***************************************************/
int main (int argc, char *argv[]) {
	int c, lo = 1, fo = 1;

	// Present a prompt and erase that prompt after the user presses any key
	printf("%s", INITIAL_PROMPT);
	waitForUser();
	char *removal_mask = malloc(sizeof(char) * strlen(INITIAL_PROMPT) + 1);
	for (int i = 0; i < (int) (strlen(INITIAL_PROMPT) + 1); i++) removal_mask[i] = '@'; 
	// printf("\r%s###########################\n", removal_mask);
	free(removal_mask);
	clearScreen();

	// Processing command arguments
	while ((c = getopt(argc, argv, "t:c:")) != -1) {
		switch (c) {
			case 't':
				menu_set_title(optarg);
				break;
			case 'c':
				menu_set_config(optarg);
				break;
		}
	}

	// Load menu
	switch (menu_load()) {
		case 1:
			fprintf(stderr, "Please set HOME environment variable.\n");
			return 1;
			break;
		case 2:
			fprintf(stderr, "Could not open config file: %s\n", menu_get_config_path());
			return 2;
			break;
		case 3:
			fprintf(stderr, "Memory allocation error. Could not open config file: %s\n", menu_get_config_path());
			return 3;
			break;
		case 4:
			fprintf(stderr, "Invalid line format detected in config file: %s.\n", menu_get_config_path());
			return 4;
			break;
	}
	
	// Initialize the terminal
	menu_init();
	
	// Display the menu
	menu_show(NAME_EXTENSION, lo, fo);
	
	// Input loop
	while ((c = getchar()) != KEY_ENTER) {
		
		// If we get an escape char, check for an arrow
		if (c == KEY_ESC && getchar() == 91) {
			c = getchar();
		}
		
		// Evaluate key
		switch (c) {
			case KEY_UP:
			case KEY_K:
			case KEY_W:
				if (lo > 1)
					--lo;
				break;
			case KEY_DOWN:
			case KEY_J:
			case KEY_S:
				if (lo < menu_get_count())
					++lo;
				break;
			case KEY_RIGHT:
			case KEY_L:
			case KEY_A:
				fo = 2;
				break;
			case KEY_LEFT:
			case KEY_H:
			case KEY_D:
				fo = 1;
				break;
		}
		
		// Update menu with new selection
		menu_show(NAME_EXTENSION, lo, fo);
	}

	// End menu display
	menu_end();
	fflush(stdout);

	// Execute chosen command
	if (fo == 1)
		menu_execute(lo);

	// Free up allocated memory used by the config module
	menu_free_all();

	return 0;
}
