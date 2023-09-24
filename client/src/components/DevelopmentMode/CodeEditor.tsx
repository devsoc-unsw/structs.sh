import React, { FC } from 'react';
import AceEditor, { IMarker } from 'react-ace';
import { socket } from 'utils/socket';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import 'styles/CodeEditor.css';

import 'ace-builds/src-noconflict/mode-c_cpp';

const placeholder = `// Linked List Program from COMP1511 Lecture 7
#include <stdio.h>
#include <stdlib.h>

struct node {
  struct node *next;
  int data;
};

int main(void) {
  // 3 separate allocations on the heap
  struct node *head = malloc(sizeof(struct node));
  struct node *linked_list_2 = malloc(sizeof(struct node));
  struct node *linked_list_3 = malloc(sizeof(struct node));

  // initialise the nodes
  head->data = 1;
  linked_list_2->data = 2;
  linked_list_3->data = 3;

  // Set the head next pointer
  // to point to the location of linked_list_2
  head->next = linked_list_2;
  linked_list_2->next = linked_list_3;
  linked_list_3->next = NULL;

  struct node *curr = head;

  while (curr != NULL) {
    printf("%d\n", curr->data);
    curr = curr->next;
  }
}
`;

const CodeEditor = ({ currLine }: { currLine: number }) => {
  const [code, setCode] = React.useState(localStorage.getItem('code') || placeholder);

  const markers: IMarker[] = [
    {
      startRow: currLine - 1,
      startCol: 0,
      endRow: currLine - 1,
      endCol: 100,
      className: 'current-line-marker',
      type: 'fullLine',
    },
  ];

  const handleChange = (newCode: string) => {
    localStorage.setItem('code', newCode);
    setCode(newCode);
  };

  const sendCode = () => {
    socket.emit('mainDebug', code);
  };

  return (
    <>
      <AceEditor
        value={code}
        onChange={handleChange}
        height="100%"
        width="100%"
        mode="c_cpp"
        markers={markers}
      />
      <Button onClick={sendCode} variant="contained" endIcon={<UploadIcon />}>
        Run
      </Button>
    </>
  );
};

export default CodeEditor;
