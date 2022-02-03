// This file contains all the commands we support in all our visualisers,
// their input rules and their man page documentation.
//
// The terminal and GUI form rely on this file to know what commands they can
// execute.
//
// Eg. in this file, we define that the linked list's `append` command should
//     take in exactly 1 argument in the terminal and GUI form.
//
// Note: the terminal and GUI menu have their independent command lists.
//       It would be better to have both use the same commands from the
//       same commands object.
//       They have very different interfaces, so having them use the
//       the same commands object is quite challenging.
//       That's why we have them separate like below.
//
// See react console emulator docs:
//     https://www.npmjs.com/package/react-console-emulator

/* -------------------------------------------------------------------------- */
/*                              Terminal Commands                             */
/* -------------------------------------------------------------------------- */
/* -------------------------- Linked List Commands -------------------------- */
const getLinkedListTerminalCommands = (processCommand) => ({
  append: {
    usage: 'append <number>',
    fn: (arg: string) => processCommand('append', [arg]),
  },
  delete: {
    usage: 'delete <number>',
    fn: (arg: string) => processCommand('delete', [arg]),
  },
  insert: {
    usage: 'insert <value> <index>',
    fn: (arg1: string, arg2: string) => processCommand('insert', [arg1, arg2]),
  },
  search: {
    usage: 'search <value>',
    fn: (arg: string) => processCommand('search', [arg]),
  },
});

/* ------------------------------ BST Commands ------------------------------ */
const getBstTerminalCommands = (processCommand) => ({
  insert: {
    usage: 'insert <number>',
    fn: (arg: string) => processCommand('insert', [arg]),
  },
  rotateLeft: {
    usage: 'rotateLeft <number>',
    fn: (arg: string) => processCommand('rotateLeft', [arg]),
  },
  rotateRight: {
    usage: 'rotateRight <number>',
    fn: (arg: string) => processCommand('rotateRight', [arg]),
  },
});

export const getVisualiserTerminalCommands = (
  topicTitle: string,
  processCommand: (command: string, args: string[]) => string,
) => {
  let terminalCommands = {};
  switch (topicTitle) {
    case 'Linked Lists':
      terminalCommands = getLinkedListTerminalCommands(processCommand);
      break;
    case 'Binary Search Trees':
      terminalCommands = getBstTerminalCommands(processCommand);
      break;
    default:
      console.error(`Can't find the terminal commands for ${topicTitle}`);
  }
  return terminalCommands;
};

/* -------------------------------------------------------------------------- */
/*                        Terminal Manual Documentation                       */
/* -------------------------------------------------------------------------- */

export interface CommandDocumentation {
  command: string;
  usage: string;
  description: string;
}

/* -------------------------- Linked List Man Page -------------------------- */
const linkedListCommandsDocumentation: CommandDocumentation[] = [
  {
    command: 'append',
    usage: 'append <number>',
    description: 'Append a node containing the number.',
  },
  {
    command: 'delete',
    usage: 'delete <index>',
    description: 'Delete a node by the index given.',
  },
  {
    command: 'insert',
    usage: 'insert <value> <index>',
    description: 'Insert a value at the given index.',
  },
  {
    command: 'search',
    usage: 'search <value>',
    description: 'Search for a value in the linked list.',
  },
];

/* ------------------------------ BST Man Page ------------------------------ */
const bstCommandsDocumentation: CommandDocumentation[] = [
  {
    command: 'insert',
    usage: 'insert <number>',
    description:
      'Executes standard BST insertion to add a new node with the given value into the tree.',
  },
  {
    command: 'rotateLeft',
    usage: 'rotateLeft <number>',
    description: 'Executes a left rotation on the node with the given value.',
  },
  {
    command: 'rotateRight',
    usage: 'rotateRight <number>',
    description: 'Executes a right rotation on the node with the given value.',
  },
];

export const getDocumentation = (topicTitle: string): CommandDocumentation[] => {
  switch (topicTitle) {
    case 'Linked Lists':
      return linkedListCommandsDocumentation;
    case 'Binary Search Trees':
      return bstCommandsDocumentation;
    default:
      console.error(`Documentation for topic: '${topicTitle}' not found`);
      return [];
  }
};

/* -------------------------------------------------------------------------- */
/*                              GUI Mode Commands                             */
/* -------------------------------------------------------------------------- */

export interface Operation {
  command: string;
  args: string[];
}

/* ------------------------- Linked List Operations ------------------------- */
const guiLinkedListCommands: Operation[] = [
  {
    command: 'append',
    args: ['value'],
  },
  {
    command: 'delete',
    args: ['index'],
  },
  {
    command: 'insert',
    args: ['value', 'index'],
  },
  {
    command: 'search',
    args: ['value'],
  },
];

/* ----------------------------- BST Operations ----------------------------- */
const guiBstCommands: Operation[] = [
  {
    command: 'insert',
    args: ['value'],
  },
  {
    command: 'rotateLeft',
    args: ['value'],
  },
  {
    command: 'rotateRight',
    args: ['value'],
  },
];

export const getGUICommands = (topicTitle: string): Operation[] => {
  switch (topicTitle) {
    case 'Linked Lists':
      return guiLinkedListCommands;
    case 'Binary Search Trees':
      return guiBstCommands;
    default:
      console.error(`GUI commands for topic '${topicTitle}' not found.`);
      return [];
  }
};
