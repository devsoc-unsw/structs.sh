// for documentation read: https://compclub.atlassian.net/wiki/spaces/S/pages/2150892071/Documentation#Visualiser-Docs%3A

const getLinkedListExecutor = (
  visualiser,
  updateTimeline,
) => (command: string, args: string[]): string => {
  console.log(command, args)
  if (!isValidCommandArgs(args, getLinkedListNumArgsRequired(command))) {
    return 'Invalid arguments: check the man page for command usage';
  }
  switch (command) {
    case 'append':
      visualiser.appendNode(Number(args[0]), updateTimeline);
      break;
    case 'delete':
      visualiser.deleteNode(Number(args[0]), updateTimeline);
      break;
    case 'insert':
      visualiser.insertNode(Number(args[0]), Number(args[1]), updateTimeline);
      break;
    case 'search':
      visualiser.searchList(Number(args[0]), updateTimeline);
      break;
    default:
      return `Invalid command: ${command}`;
  }
  return '';
};

const getBSTExecutor = (
  visualiser,
  updateTimeline,
) => (command: string, args: string[]): string => {
  if (!isValidCommandArgs(args, getBSTNumArgsRequired(command))) {
    return 'Invalid arguments: check the man page for command usage';
  }
  switch (command) {
    case 'insert':
      visualiser.insert(Number(args[0]), updateTimeline);
      break;
    case 'rotateLeft':
      visualiser.rotateLeft(Number(args[0]), updateTimeline);
      break;
    case 'rotateRight':
      visualiser.rotateRight(Number(args[0]), updateTimeline);
      break;
    case 'inorderTraversal':
      visualiser.inorderTraversal(updateTimeline);
      break;
    case 'preorderTraversal':
      visualiser.preorderTraversal(updateTimeline);
      break;
    case 'postorderTraversal':
      visualiser.postorderTraversal(updateTimeline);
      break;
    default:
      return `Invalid command: ${command}`;
  }
  return '';
};

const undefinedExecutor = (topicTitle) => (command: string, args: string[]): string => {
  console.error(`Can't find the executor for ${topicTitle}`);
  return '';
};

const isValidCommandArgs = (args: string[], numExpectedArgs: number): boolean => {
  return args.length === numExpectedArgs && args.every((value) => /^\d+$/.test(value));
}

const getLinkedListNumArgsRequired = (command: string): number => {
  switch (command) {
    case 'insert':
      return 2;
    default:
      return 1;
  }
}

const getBSTNumArgsRequired = (command: string): number => {
  switch (command) {
    case 'inorderTraversal': case 'preorderTraversal': case 'postorderTraversal': 
      return 0;
    default:
      return 1;
  }
}

const getCommandExecutor = (topicTitle, visualiser, updateTimeline) => {
  switch (topicTitle) {
    case 'Linked Lists':
      return getLinkedListExecutor(visualiser, updateTimeline);
    case 'Binary Search Trees':
      return getBSTExecutor(visualiser, updateTimeline);
    default:
      return undefinedExecutor(topicTitle);
  }
};

export default getCommandExecutor;
