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

// TODO: how can we more easily store the code snippets? (maybe move into database)

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
  prepend: {
    usage: 'prepend <value>',
    fn: (arg: string) => processCommand('prepend', [arg]),
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
  inorderTraversal: {
    usage: 'inorderTraversal',
    fn: () => processCommand('inorderTraversal', []),
  },
  preorderTraversal: {
    usage: 'preorderTraversal',
    fn: () => processCommand('preorderTraversal', []),
  },
  postorderTraversal: {
    usage: 'postorderTraversal',
    fn: () => processCommand('postorderTraversal', []),
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
    usage: 'append <value [0-999]>',
    description: 'Append a node containing the value.',
  },
  {
    command: 'delete',
    usage: 'delete <index>',
    description: 'Delete a node by the index given.',
  },
  {
    command: 'insert',
    usage: 'insert <value [0-999]> <index>',
    description: 'Insert a value at the given index.',
  },
  {
    command: 'search',
    usage: 'search <value [0-999]>',
    description: 'Search for a value in the linked list.',
  },
  {
    command: 'prepend',
    usage: 'prepend <value [0-999]>',
    description: 'Prepend a node containing the value.',
  },
];

/* ------------------------------ BST Man Page ------------------------------ */
const bstCommandsDocumentation: CommandDocumentation[] = [
  {
    command: 'insert',
    usage: 'insert <value [0-999]>',
    description:
      'Executes standard BST insertion to add a new node with the given value into the tree.',
  },
  {
    command: 'rotateLeft',
    usage: 'rotateLeft <value [0-999]>',
    description: 'Executes a left rotation on the node with the given value.',
  },
  {
    command: 'rotateRight',
    usage: 'rotateRight <value [0-999]>',
    description: 'Executes a right rotation on the node with the given value.',
  },
  {
    command: 'inorderTraversal',
    usage: 'inorderTraversal',
    description: 'Executes an inorder traversal on the tree.',
  },
  {
    command: 'preorderTraversal',
    usage: 'preorderTraversal',
    description: 'Executes a preorder traversal on the tree.',
  },
  {
    command: 'postorderTraversal',
    usage: 'postorderTraversal',
    description: 'Executes a postorder traversal on the tree.',
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
  code: string[];
}

/* ------------------------- Linked List Operations ------------------------- */
const guiLinkedListCommands: Operation[] = [
  {
    command: 'append',
    args: ['value'],
    code: ['a']
  },
  {
    command: 'delete',
    args: ['index'],
    code: ['a']
  },
  {
    command: 'insert',
    args: ['value', 'index'],
    code: ['a']
  },
  {
    command: 'search',
    args: ['value'],
    code: ['a']
  },
  {
    command: 'prepend',
    args: ['value'],
    code: ['a']
  },
];

/* ----------------------------- BST Operations ----------------------------- */
const guiBstCommands: Operation[] = [
  {
    command: 'insert',
    args: ['value'],
    code: [
      'while current not null',
      '  if value to be inserted < current.val',
      '    if current.left is null',
      '      current.left = node to be inserted',
      '      return',
      '    current = current.left',
      '  else',
      '    if current.right is null',
      '      current.right = node to be inserted',
      '      return',
      '    current = current.right'
    ],
  },
  {
    command: 'rotateLeft',
    args: ['value'],
    code: ['a'],
  },
  {
    command: 'rotateRight',
    args: ['value'],
    code: ['a'],
  },
  {
    command: 'inorderTraversal',
    args: [],
    code: [
      'if current is null',
      '  return',
      'do inorder traversal on current.left',
      'visit current',
      'do inorder traversal on current.right'
    ],
  },
  {
    command: 'preorderTraversal',
    args: [],
    code: ['a']
  },
  {
    command: 'postorderTraversal',
    args: [],
    code: ['a']
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
