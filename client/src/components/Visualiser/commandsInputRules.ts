// TODO: documentation

// Note: the terminal and GUI menu have their independent command lists.
//       It would be better to have both use the same commands from the
//       same commands object.
//       They have very different interfaces, so having them use the
//       the same commands object is quite challenging.
//       That's why we have them separate like below.
//
// See react console emulator docs: https://www.npmjs.com/package/react-console-emulator

/* -------------------------------------------------------------------------- */
/*                              Terminal Commands                             */
/* -------------------------------------------------------------------------- */
export const getVisualiserTerminalCommands = (
    topicTitle: string,
    processCommand: (command: string, args: string[]) => string
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

const getLinkedListTerminalCommands = (processCommand) => {
    return {
        append: {
            usage: 'append <number>',
            fn: (arg: string) => {
                return processCommand('append', [arg]);
            },
        },
        delete: {
            usage: 'delete <number>',
            fn: (arg: string) => {
                return processCommand('delete', [arg]);
            },
        },
        insert: {
            usage: 'insert <value> <index>',
            fn: (arg1: string, arg2: string) => {
                return processCommand('insert', [arg1, arg2]);
            },
        },
        search: {
            usage: 'search <value>',
            fn: (arg: string) => {
                return processCommand('search', [arg]);
            },
        },
    };
};

const getBstTerminalCommands = (processCommand) => {
    return {
        insert: {
            usage: 'insert <number>',
            fn: (arg: string) => {
                return processCommand('insert', [arg]);
            },
        },
        rotateLeft: {
            usage: 'rotateLeft <number>',
            fn: (arg: string) => {
                return processCommand('rotateLeft', [arg]);
            },
        },
        rotateRight: {
            usage: 'rotateRight <number>',
            fn: (arg: string) => {
                return processCommand('rotateRight', [arg]);
            },
        },
    };
};

/* -------------------------------------------------------------------------- */
/*                        Terminal Manual Documentation                       */
/* -------------------------------------------------------------------------- */

export interface CommandDocumentation {
    command: string;
    usage: string;
    description: string;
}

export const getDocumentation = (topicTitle: string): CommandDocumentation[] => {
    switch (topicTitle) {
        case 'Linked Lists':
            return linkedListCommandsDocumentation;
        case 'Binary Search Trees':
            return bstCommandsDocumentation;
        default:
            console.error(`Documentation for topic: '${topicTitle}' not found`);
    }
};

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

/* -------------------------------------------------------------------------- */
/*                              GUI Mode Commands                             */
/* -------------------------------------------------------------------------- */

export interface Operation {
    command: string;
    args: string[];
}

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
