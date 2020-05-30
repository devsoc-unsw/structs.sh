#ifndef CJAG_COLORPRINT
#define CJAG_COLORPRINT

#define ERROR_TAG "[r][ERROR][/r] "

void printf_color(int color, const char *fmt, ...);

void spinner_start(int color, unsigned int type, const char* fmt, ...);
void spinner_update(int color, const char* fmt, ...);
void spinner_done(int color, const char* fmt, ...);

void progress_start(int color, int max, char* fmt);
void progress_update(int color);

#endif