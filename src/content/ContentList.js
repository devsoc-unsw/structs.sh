// TODO: good file to convert to typescript

// TODO: might be better to migrate these to API calls to a backend server
const topics = {
    'linked-list': {
        description: 'A sequence of nodes',
        videos: ['qHIflU8C0WY'],
    },
    'binary-search-tree': {
        description:
            'A binary search tree is a data structure that quickly allows us to maintain a sorted list of numbers. ee is node where the ',
        videos: ['DCIbWxmFq-M'],
    },
};

const getLessonContent = async (lesson) => {
    if (!(lesson in topics)) {
        // TODO: introduce custom exceptions?
        throw new Error(`Lesson for ${lesson} doesn't exist`);
    }
    return topics[lesson];
};

export default getLessonContent;
