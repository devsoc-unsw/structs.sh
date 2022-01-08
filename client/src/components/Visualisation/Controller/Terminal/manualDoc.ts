const commands = [
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
        description: 'Insert a value at the given index',
    },
    {
        command: 'search',
        usage: 'search <value>',
        description: 'Search for a value in the linked list',
    },
];

export default commands;
