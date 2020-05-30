#include <stdarg.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "coloured.h"

#ifndef STRICT
#define STRICT 0
#endif

#ifndef DEBUG
#define DEBUG (void)
#endif

#define MAX_COMMAND_LENGTH 16


typedef enum {
    RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, RESET, LIGHTRED, LIGHTGREEN, LIGHTYELLOW, LIGHTBLUE, LIGHTMAGENTA, LIGHTCYAN, LIGHTWHITE
} ansi_color_t;


typedef enum {
    TAG_OPEN,
    TAG_CLOSE
} tag_t;

typedef enum {
    FOREGROUND,
    BACKGROUND
} color_type_t;

typedef struct {
    ansi_color_t stack[16];
    int ptr;
} colorstack_t;

typedef struct {
    char raw[MAX_COMMAND_LENGTH];
    int valid;
    tag_t tag;
    size_t length;
} command_t;

typedef struct {
    size_t len;
    size_t capacity;
    char* data;
} buffer_t;

typedef struct {
    ansi_color_t color;
    color_type_t type;
} color_t;


static const char *fg_color_strings[] = {
        [RED] = "31",
        [GREEN] = "32",
        [YELLOW] = "33",
        [BLUE] = "34",
        [MAGENTA] = "35",
        [CYAN] = "36",
        [WHITE] = "37",
        [RESET] = "0",
        [LIGHTRED] = "91",
        [LIGHTGREEN] = "92",
        [LIGHTYELLOW] = "93",
        [LIGHTBLUE] = "94",
        [LIGHTMAGENTA] = "95",
        [LIGHTCYAN] = "96",
        [LIGHTWHITE] = "97"
};


static const char *bg_color_strings[] = {
        [RESET] = "49",
        [RED] = "41",
        [GREEN] = "42",
        [YELLOW] = "43",
        [BLUE] = "44",
        [MAGENTA] = "45",
        [CYAN] = "46",
        [WHITE] = "47",
        [LIGHTRED] = "101",
        [LIGHTGREEN] = "102",
        [LIGHTYELLOW] = "103",
        [LIGHTBLUE] = "104",
        [LIGHTMAGENTA] = "105",
        [LIGHTCYAN] = "106",
        [LIGHTWHITE] = "107"
};


static void buffer_increase_size(buffer_t* buffer, size_t size) {
    while(buffer->len + size >= buffer->capacity) {
        if(buffer->capacity < 128) buffer->capacity = 128;
        else buffer->capacity *= 2;
    }
    buffer->data = realloc(buffer->data, buffer->capacity);
    memset(buffer->data + buffer->len, 0, buffer->capacity - buffer->len);
}


static buffer_t* buffer_create(size_t len) {
    buffer_t* b = (buffer_t*)malloc(sizeof(buffer_t));
    b->len = 0;
    b->capacity = 0;
    b->data = NULL;
    buffer_increase_size(b, len);
    return b;
}

static void buffer_append_char(buffer_t* buffer, char c) {
    buffer_increase_size(buffer, 1);
    buffer->data[buffer->len++] = c;
    buffer->data[buffer->len] = 0;
}

static void buffer_append_string(buffer_t* buffer, char* str) {
    buffer_increase_size(buffer, strlen(str));
    strcpy(buffer->data + buffer->len, str);
    buffer->len += strlen(str);
    buffer->data[buffer->len] = 0;
}


static void colorstack_push(colorstack_t *stack, ansi_color_t color) {
    if (stack->ptr >= 16) {
        return;
    }
    stack->stack[stack->ptr++] = color;
}

static ansi_color_t colorstack_pop(colorstack_t *stack) {
    if (stack->ptr <= 0) {
        return RESET;
    }
    return stack->stack[--stack->ptr];
}

static int parse_command(const char* str, command_t* cmd) {
    size_t i = 0;
    cmd->valid = 0;
    size_t len = strlen(str);
    if(*str != '[') return 0;

    while(i < len) {
        if(str[i] == ' ') {
            break;
        }
        if(str[i] == ']') {
            cmd->valid = 1;
            break;
        }
        i++;
    }
    if(!cmd->valid) return 0;

    int closing = 0;
    if(len > 1) {
        if(str[1] == '/') {
            cmd->tag = TAG_CLOSE;
            closing = 1;
        }
        else cmd->tag = TAG_OPEN;
    }

    if(i < MAX_COMMAND_LENGTH) {
        memset(cmd->raw, 0, MAX_COMMAND_LENGTH);
        memcpy(cmd->raw, str + closing + 1, i - closing - 1);
    }

    cmd->length = strlen(cmd->raw) + 1 + closing;

    return cmd->length;
}

static int parse_color(const char* str, color_t* color) {
    if(!strcmp(str, "r") || !strcmp(str, "red")) {
        color->color = RED;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "g") || !strcmp(str, "green")) {
        color->color = GREEN;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "b") || !strcmp(str, "blue")) {
        color->color = BLUE;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "c") || !strcmp(str, "cyan")) {
        color->color = CYAN;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "m") || !strcmp(str, "magenta")) {
        color->color = MAGENTA;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "y") || !strcmp(str, "yellow")) {
        color->color = YELLOW;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "w") || !strcmp(str, "white")) {
        color->color = WHITE;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lr")) {
        color->color = LIGHTRED;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lg")) {
        color->color = LIGHTGREEN;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lb")) {
        color->color = LIGHTBLUE;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lc")) {
        color->color = LIGHTCYAN;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lm")) {
        color->color = LIGHTMAGENTA;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "ly")) {
        color->color = LIGHTYELLOW;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "lw")) {
        color->color = LIGHTWHITE;
        color->type = FOREGROUND;
    } else if(!strcmp(str, "br")) {
        color->color = RED;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bg")) {
        color->color = GREEN;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bb")) {
        color->color = BLUE;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bc")) {
        color->color = CYAN;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bm")) {
        color->color = MAGENTA;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "by")) {
        color->color = YELLOW;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bw")) {
        color->color = WHITE;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blr")) {
        color->color = LIGHTRED;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blg")) {
        color->color = LIGHTGREEN;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blb")) {
        color->color = LIGHTBLUE;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blc")) {
        color->color = LIGHTCYAN;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blm")) {
        color->color = LIGHTMAGENTA;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "bly")) {
        color->color = LIGHTYELLOW;
        color->type = BACKGROUND;
    } else if(!strcmp(str, "blw")) {
        color->color = LIGHTWHITE;
        color->type = BACKGROUND;
    } else {
        return 0;
    }
    return 1;
}

static void vprintf_color(int enable, const char* fmt, va_list arg) {
    colorstack_t stack;
    memset(&stack, 0, sizeof(stack));
    colorstack_t bgstack;
    memset(&bgstack, 0, sizeof(bgstack));

    int i, len = strlen(fmt);
    buffer_t *fmt_replace = buffer_create(len);
    command_t command = {.valid = 0};
    ansi_color_t color = RESET;
    ansi_color_t bgcolor = RESET;
    for (i = 0; i < len; i++) {
        i += parse_command(fmt + i, &command);
        int set_color = 0;
        int set_bgcolor = 0;
        if(command.valid) {
            if(command.tag == TAG_CLOSE) {
                color_t parsed_color;
                if(parse_color(command.raw, &parsed_color)) {
                    if(parsed_color.type == FOREGROUND) {
                        set_color = 1;
#if STRICT
                        if(color != parsed_color.color) {
                            DEBUG("Warning: tag [/%s] does not match!\n", command.raw);
                        } else {
                            color = colorstack_pop(&stack);
                        }
#else
                        color = colorstack_pop(&stack);
#endif
                    } else {
                        set_bgcolor = 1;
#if STRICT
                        if(bgcolor != parsed_color.color) {
                            DEBUG("Warning: tag [/%s] does not match!\n", command.raw);
                        } else {
                            bgcolor = colorstack_pop(&bgstack);
                        }
#else
                        bgcolor = colorstack_pop(&bgstack);
#endif
                    }
                } else {
                    command.valid = 0;
                    i -= command.length;
                }
            } else {
                ansi_color_t last_color = color;
                ansi_color_t last_bgcolor = bgcolor;
                color_t parsed_color;
                if(parse_color(command.raw, &parsed_color)) {
                    if(parsed_color.type == FOREGROUND) {
                        color = parsed_color.color;
                        set_color = 1;
                    } else {
                        bgcolor = parsed_color.color;
                        set_bgcolor = 1;
                    }
                } else {
                    command.valid = 0;
                    i -= command.length;
                }
                if(command.valid) {
                    if(set_color) {
                        colorstack_push(&stack, last_color);
                    }
                    if(set_bgcolor) {
                        colorstack_push(&bgstack, last_bgcolor);
                    }
                }
            }
            if(enable && command.valid) {
                if(set_color || set_bgcolor) {
                    char format[32];
                    sprintf(format, "\x1b[%s;%sm", fg_color_strings[color], bg_color_strings[bgcolor]);
                    buffer_append_string(fmt_replace, format);
                }
            }
        }


        if(!command.valid) {
            buffer_append_char(fmt_replace, fmt[i]);
        }
    }

#if STRICT
    if(stack.ptr > 0 || bgstack.ptr > 0) {
        DEBUG("Warning: Missing closing tag\n");
        buffer_append_string(fmt_replace, "\x1b[0m");
    }
#endif

    vfprintf(stdout, fmt_replace->data, arg);
    free(fmt_replace->data);
    free(fmt_replace);

}


void printf_color(int enable, const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    vprintf_color(enable, fmt, ap);
    va_end(ap);
}


static int spinner_state = 0;
static const char* spinner_value_0[] = {
    "|",
    "/",
    "-",
    "\\",
    NULL
};

static const char* spinner_value_1[] = {
  "\x1b(0t\x1b(A",
  "\x1b(0w\x1b(A",
  "\x1b(0u\x1b(A",
  "\x1b(0v\x1b(A",
  NULL
};

static const char* spinner_value_2[] = {
  "\x1b(0j\x1b(A",
  "\x1b(0m\x1b(A",
  "\x1b(0l\x1b(A",
  "\x1b(0k\x1b(A",
  NULL
};

static const char* spinner_value_3[] = {
  "\x1b(0m\x1b(A",
  "\x1b(0t\x1b(A",
  "\x1b(0n\x1b(A",
  "\x1b(0u\x1b(A",
  "\x1b(0j\x1b(A",
  NULL
};

static const char* spinner_value_4[] = {
  "\x1b(0m\x1b(A",
  "\x1b(0x\x1b(A",
  "\x1b(0l\x1b(A",
  "\x1b(0q\x1b(A",
  "\x1b(0k\x1b(A",
  "\x1b(0x\x1b(A",
  "\x1b(0j\x1b(A",
  "\x1b(0q\x1b(A",
  NULL
};

static const char** spinner_values[] = {
  spinner_value_0, spinner_value_1, spinner_value_2, spinner_value_3, spinner_value_4
};

static char** spinner_value = (char**)spinner_value_0;

void spinner_start(int color, unsigned int type, const char* fmt, ...) {
    spinner_value = (char**)spinner_values[type % (sizeof(spinner_values) / sizeof(spinner_values[0]))];
    spinner_state = 0;
    printf("\x1b[s[%s] ", spinner_value[spinner_state]);
    va_list ap;
    va_start(ap, fmt);
    vprintf_color(color, fmt, ap);
    va_end(ap);
    fflush(stdout);
}


void spinner_update(int color, const char* fmt, ...) {
    spinner_state++;
    if(!spinner_value[spinner_state]) spinner_state = 0;
    printf("\x1b[u[%s] \x1b[K", spinner_value[spinner_state]);
    va_list ap;
    va_start(ap, fmt);
    vprintf_color(color, fmt, ap);
    va_end(ap);
    fflush(stdout);
}


void spinner_done(int color, const char* fmt, ...) {
    printf("\x1b[u[#] \x1b[K");
    va_list ap;
    va_start(ap, fmt);
    vprintf_color(color, fmt, ap);
    va_end(ap);
    fflush(stdout);
}


static int progress_state, progress_max;
char* progress_format;

void progress_start(int color, int max, char* fmt) {
    progress_state = 0;
    progress_max = max;
    progress_format = "[g]\x1b(0a\x1b(B[/g]";
    if(fmt != NULL) progress_format = fmt;
    printf_color(color, "\x1b[s\x1b(0x\x1b(B");
    int i;
    for(i = 0; i < 40; i++) {
        printf(" ");
    }
    printf_color(color, "\x1b(0x\x1b(B %3d%%", 0);
    fflush(stdout);
}


void progress_update(int color) {
    progress_state++;
    if(progress_state > progress_max) {
        progress_state = progress_max;
    }
    printf_color(1, "\x1b[u\x1b(0x\x1b(B");
    int i;
    for(i = 0; i < 40 * progress_state / progress_max; i++) {
        printf_color(color, progress_format);
    }
    for(; i < 40; i++) {
        printf(" ");
    }
    printf_color(1, "\x1b(0x\x1b(B %3d%%", 100 * progress_state / progress_max);
    if(progress_state == progress_max) printf("\n");
    fflush(stdout);
}