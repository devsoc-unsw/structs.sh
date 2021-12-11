export interface Operation {
    command: string;
    args: string[];
}

export interface OperationDictionary {
    [key: string]: Operation[];
}

export const operationsDictionary: OperationDictionary = {
    'Linked Lists': [
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
            args: ['index'],
        },
        {
            command: 'search',
            args: ['value'],
        },
    ],
    'Binary Search Trees': [
        {
            command: 'insert',
            args: ['value'],
        },
    ],
    Graphs: [
        {
            command: 'depth-first search',
            args: ['src'],
        },
    ],
};
