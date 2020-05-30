#include <stdio.h>
#include <unistd.h>
#include "coloured.h"

int main(int argc, char* argv[]) {
    (void)argv;
    int color = argc < 2;

    printf_color(color, "[red][blr]Color[/blr][magenta][blm]ful[/blm][/magenta][/red] [bly][yellow]print[green][blg]f[/blg][/green][/yellow][/bly]\n\n");

    printf_color(color, "[lr][br][+][/br][/lr] This shows for example an [lr]error[/lr] due to [lg]some [by]weird[/by] value[/lg]\n");
    printf_color(color, "[ly][by][*][/by][/ly] Starting a [lw]long running[/lw] job\n");

    spinner_start(color, 0, "Initialize...");
    int i, mul = 10;
    for(i = 0; i < 10 * mul; i++) {
        usleep(1000000 / mul);
        spinner_update(color, "Test [bw][red]%d[/red][/bw]...", i);
    }
    spinner_done(color, "Done!\n");
    printf_color(color, "[lg][bg][+][/bg][/lg] Task was successful!\n");

    printf_color(color, "[ly][by][*][/by][/ly] Starting a job with progress bar\n");

    printf("The task: ");
    fflush(stdout);
    progress_start(color, 10, NULL);
    for(i = 0; i < 10; i++) {
        usleep(100000);
        progress_update(color);
    }

    printf_color(color, "\nHere is your rainbow: ");
    printf_color(color, "[r]R[/r][g]a[/g][b]i[/b][c]n[/c][m]b[/m][y]o[/y][w]w[/w] ");
    printf_color(color, "[lr]R[/lr][lg]a[/lg][lb]i[/lb][lc]n[/lc][lm]b[/lm][ly]o[/ly][lw]w[/lw] ");

    printf_color(color, "[br]R[/br][bg]a[/bg][bb]i[/bb][bc]n[/bc][bm]b[/bm][by]o[/by][bw]w[/bw] ");
    printf_color(color, "[blr]R[/blr][blg]a[/blg][blb]i[/blb][blc]n[/blc][blm]b[/blm][bly]o[/bly][blw]w[/blw]\n");

    printf_color(color, "\n[lb][bb][!][/bb][/lb] Everything finished\n");
    return 0;
}