// TODO: good file to convert to typescript

// TODO: might be better to migrate these to API calls to a backend server
const topics = {
    'linked-list': {
        title: 'Linked Lists',
        description: 'In computer science, a linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next. It is a data structure consisting of a collection of nodes which together represent a sequence.',
        videos: ['qHIflU8C0WY'],
    },
    'binary-search-tree': {
        title: 'Binary Search Trees',
        description:
            "In computer science, a binary search tree, also called an ordered or sorted binary tree, is a rooted binary tree whose internal nodes each store a key greater than all the keys in the node's left subtree and less than those in its right subtree.",
        videos: ['DCIbWxmFq-M'],
    },
    'graph': {
        title: 'Graph',
        description:
            'As used in graph theory, the term graph does not refer to data charts, such as line graphs or bar graphs. Instead, it refers to a set of vertices (that is, points or nodes) and of edges (or lines) that connect the vertices. When any two vertices are joined by more than one edge, the graph is called a multigraph.',
        videos: ['S2BehYAB_hY'],
    }
};

const getLessonContent = async (lesson) => {
    if (!(lesson in topics)) {
        // TODO: introduce custom exceptions?
        throw new Error(`Lesson for ${lesson} doesn't exist`);
    }
    return topics[lesson];
};

export default getLessonContent;
