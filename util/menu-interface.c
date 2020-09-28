#include <stdlib.h>
#include <unistd.h>
#include "menu-interface.h"
#include "display/display.h"

#define PATH_TO_MENU_BIN "/home/tim/Projects/DataStructures/terminal-menu.rb"

void returnToMenu() {
	printHeader("Selection Menu");
	execl("/usr/bin/ruby", "/usr/bin/ruby", PATH_TO_MENU_BIN, (char *) NULL);
}

