// for documentation read:
// https://compclub.atlassian.net/wiki/spaces/S/pages/2150892071/Documentation#Visualiser-Docs%3A

import { getDocumentation, getGUICommands } from './commandsInputRules';

const isValidCommandArgs = (command: string, args: string[], topicTitle: string): boolean => {
  const currentOperation = getGUICommands(topicTitle).find(
    (operation) => operation.command === command,
  );

  if (args.length !== currentOperation.args.length) return false;

  if (!args.every((value) => /^\d+$/.test(value))) return false;

  const valueIndex = currentOperation.args.indexOf('value');

  if (valueIndex !== -1) {
    return Number(args[valueIndex]) >= 0 && Number(args[valueIndex]) <= 999;
  }

  return true;
};

const getLinkedListExecutor = (visualiser, updateTimeline, updateCode, updateLine) => (command: string, args: string[], code: string[]): string => {
  if (!isValidCommandArgs(command, args, 'Linked Lists')) {
    const { usage } = getDocumentation('Linked Lists').find(
      (operation) => operation.command === command,
    );
    return `Invalid arguments. Usage: ${usage}`;
  }

  updateCode(code);

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
    case 'prepend':
      visualiser.prependNode(Number(args[0]), updateTimeline);
      break;
    default:
      return `Invalid command: ${command}`;
  }
  return '';
};

const getBSTExecutor = (visualiser, updateTimeline, updateCode, updateLine) => (command: string, args: string[], code: string[]): string => {
  if (!isValidCommandArgs(command, args, 'Binary Search Trees')) {
    const { usage } = getDocumentation('Binary Search Trees').find(
      (operation) => operation.command === command,
    );
    return `Invalid arguments. Usage: ${usage}`;
  }

  updateCode(code);

  switch (command) {
    case 'insert':
      visualiser.insert(Number(args[0]), updateTimeline, updateLine);
      break;
    case 'rotateLeft':
      visualiser.rotateLeft(Number(args[0]), updateTimeline, updateLine);
      break;
    case 'rotateRight':
      visualiser.rotateRight(Number(args[0]), updateTimeline, updateLine);
      break;
    case 'inorderTraversal':
      visualiser.inorderTraversal(updateTimeline, updateLine);
      break;
    case 'preorderTraversal':
      visualiser.preorderTraversal(updateTimeline, updateLine);
      break;
    case 'postorderTraversal':
      visualiser.postorderTraversal(updateTimeline, updateLine);
      break;
    default:
      return `Invalid command: ${command}`;
  }
  return '';
};

const undefinedExecutor = (topicTitle) => (command: string, args: string[], code: string[]): string => {
  console.error(`Can't find the executor for ${topicTitle}`);
  return '';
};

const getCommandExecutor = (topicTitle, visualiser, updateTimeline, updateCode, updateLine) => {
  switch (topicTitle) {
    case 'Linked Lists':
      return getLinkedListExecutor(visualiser, updateTimeline, updateCode, updateLine);
    case 'Binary Search Trees':
      return getBSTExecutor(visualiser, updateTimeline, updateCode, updateLine);
    default:
      return undefinedExecutor(topicTitle);
  }
};

export default getCommandExecutor;
