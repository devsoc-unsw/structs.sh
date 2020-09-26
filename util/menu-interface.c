#include <stdlib.h>
#include <unistd.h>
#include "menu-interface.h"

#define PATH_TO_MENU_BIN "../../util/terminal-menu/bin/menu"
#define PATH_TO_CONFIG   "../../util/terminal-menu/.menu-options"

void returnToMenu() {
	execl("/bin/sh", "/bin/sh", "-c", PATH_TO_MENU_BIN, PATH_TO_CONFIG, (char *) NULL);
}

