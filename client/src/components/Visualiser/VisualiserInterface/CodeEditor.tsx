import { useState } from 'react';
import { Box } from '@mui/material';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';

const program = `// append.c

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
    curr->next = new_tail;
}
`;

const CodeEditor = () => {
  const [code, setCode] = useState(program);
  let markers = [];
  // markers.push({
  //   startRow: 6,
  //   endRow: 7,
  //   className: 'replacement_marker',
  //   type: 'text',
  // });
  return (
    <AceEditor
      mode="c_cpp"
      theme="dracula"
      height="100%"
      width="60%"
      showPrintMargin={false}
      fontSize="16px"
      onChange={(value) => setCode(value)}
      markers={markers}
      value={code}
    />
  );
};

export default CodeEditor;
