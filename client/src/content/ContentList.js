// TODO: good file to convert to typescript

// TODO: might be better to migrate these to API calls to a backend server
const topics = {
    'linked-list': {
        title: 'Linked Lists',
        description:
            'In computer science, a linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next. It is a data structure consisting of a collection of nodes which together represent a sequence.',
        videos: ['qHIflU8C0WY'],
        label: 'comp1511',
        ops: [
            {
                command: 'append',
                args: ['value']
            },
            {
                command: 'delete',
                args: ['index']
            },
            {
                command: 'insert',
                args: ['index', 'value']
            }
        ]
    },
    'binary-search-tree': {
        title: 'Binary Search Trees',
        description:
            "In computer science, a binary search tree, also called an ordered or sorted binary tree, is a rooted binary tree whose internal nodes each store a key greater than all the keys in the node's left subtree and less than those in its right subtree.",
        videos: ['DCIbWxmFq-M'],
        label: 'comp2521',
        ops: [
            {
                command: 'insert',
                args: ['value']
            }, {
                command: 'delete',
                args: ['value']
            }
        ]
    },
    graph: {
        title: 'Graph',
        description:
            'As used in graph theory, the term graph does not refer to data charts, such as line graphs or bar graphs. Instead, it refers to a set of vertices (that is, points or nodes) and of edges (or lines) that connect the vertices. When any two vertices are joined by more than one edge, the graph is called a multigraph.',
        videos: ['S2BehYAB_hY'],
        label: 'comp2521',
        ops: [
            {
                command: 'BFS',
                args: ['source']
            }, {
                command: 'DFS',
                args: ['source']
            }
        ]
    },
    sorting: {
        title: 'Sorting',
        description:
            'In computer science, a sorting algorithm is an algorithm that puts elements of a list in a certain order.',
        videos: ['3mxp4JLGasE'],
        label: 'comp2521',
        ops: ['insert', 'delete']
    },
};

export const getLessonContent = async (lesson) => {
    if (!(lesson in topics)) {
        // TODO: introduce custom exceptions?
        throw new Error(`Lesson for ${lesson} doesn't exist`);
    }
    return topics[lesson];
};

export const getTopicOps = async (topic) => {
    return topics[topic].ops;
};

export const getMatchedLessons = async (course) => {
    var matchedLessons = []
    Object.keys(topics).forEach((lesson) => {

        if (course.test(topics[lesson].label)) {
            matchedLessons.push({ topic: lesson, title: topics[lesson].title })
        }
    })
    return matchedLessons;
}
