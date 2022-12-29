import { useState, useEffect } from 'react';
import { Button, useTheme } from '@mui/material';
import Editor, { loader } from '@monaco-editor/react';
import monokai from 'monaco-themes/themes/Monokai.json';
import githubDark from 'monaco-themes/themes/GitHub Dark.json';
import { Box } from '@mui/system';
import Console from './Console';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const program = `#include <stdio.h>
#include <stdlib.h>

struct list {
    struct node *head;
};

struct node {
    int data;
    struct node *next; 
};

struct node *create_new_node(int data) {
    struct node *new = malloc(sizeof(struct node));
    new->data = data;
    new->next = NULL;
    return new;
}

void append(int value, struct list *list) {
    struct node *new_tail = create_new_node(value);
    if (list->head == NULL) {
        list->head = new_tail;
        return;
    }

    struct node *curr = list->head;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    curr->next = new_tail
};


int main(int argc, char *argv[]) {
    // Declare pointer to the head of the linked list, which is empty
    struct list *list = malloc(sizeof(struct list));
    list->head = NULL;
    append(5, list);
    append(10, list);
}
`;

const Debugger = () => {
  const [code, setCode] = useState(program);
  const theme = useTheme();
  const handleEditorChange = (value: string) => {
    // setValue(value);
    setCode(value);
    console.log(value);
    console.log(code);
  };
  useEffect(() => {
    loader.init().then((monaco) => {
      // monaco.editor.defineTheme('monokai', monokai);
      monaco.editor.defineTheme('githubDark', githubDark);
    });
  }, []);
  return (
    <Box
      // position="absolute"
      // width="40vw"
      // height="100vh"
      // right={0}
      // top={0}
      width="40vw"
      height="100vh"
      bgcolor={theme.palette.background.default}
      zIndex="1000"
    >
      <Box display="flex" gap={2} paddingLeft={2} paddingBottom={1} paddingTop={1}>
        <Button variant="contained">
          <BuildIcon />
          Compile
        </Button>
        <Button variant="contained">
          <PlayArrowIcon />
          Visualise
        </Button>
      </Box>
      <Box display="flex" flexDirection="column">
        <Editor
          language="c"
          theme="githubDark"
          height="60vh"
          options={{
            minimap: {
              enabled: false,
            },
          }}
          value={code}
          onChange={handleEditorChange}
        />
        <Console />
      </Box>
    </Box>
  );
};

export default Debugger;
