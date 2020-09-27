#include <stdlib.h>
#include <unistd.h>
#include "menu-interface.h"

#define PATH_TO_MENU_BIN "/home/tim/Projects/DataStructures/terminal-menu.rb"
#define PATH_TO_CONFIG   "../../util/terminal-menu/.menu-options"

void returnToMenu() {
	execl("/usr/bin/ruby", "/usr/bin/ruby", PATH_TO_MENU_BIN, (char *) NULL);
}

