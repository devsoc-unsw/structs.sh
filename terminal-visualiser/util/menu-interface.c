#include <stdlib.h>
#include <unistd.h>
#include "menu-interface.h"
#include "display/display.h"

#define MAX_PATH_LEN 255

void returnToMenu() {
	char buf[MAX_PATH_LEN];
	getcwd(buf, MAX_PATH_LEN);
	strcat(buf, "/terminal-menu.rb");
	printHeader("Selection Menu");
	execl("/usr/bin/ruby", "/usr/bin/ruby", buf, (char *) NULL);
}

