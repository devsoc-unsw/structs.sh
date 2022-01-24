// TODO: DOCUMENTATION
export const getCommandExecutor = (topicTitle, visualiser, updateTimeline) => {
    switch (topicTitle) {
        case 'Linked Lists':
            return getLinkedListExecutor(visualiser, updateTimeline);
        case 'Binary Search Trees':
            return getBSTExecutor(visualiser, updateTimeline);
        default:
            console.error(`Can't find the executor for ${topicTitle}`);
    }
};

const getLinkedListExecutor = (visualiser, updateTimeline) => {
    return (command: string, args: string[]): string => {
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
};

const getBSTExecutor = (visualiser, updateTimeline) => {
    return (command: string, args: string[]): string => {
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
            default:
                return `Invalid command: ${command}`;
        }
        return '';
    };
};
