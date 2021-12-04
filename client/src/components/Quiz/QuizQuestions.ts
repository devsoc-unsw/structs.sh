export const quiz = {
    quizTitle: 'Example quiz',
    quizSummary: 'Test your knowledge',
    questions: [
        {
            questionNum: 1,
            question: 'Is this a valid example of a linked list node?',
            code: ['struct node {', '    int data', '    int nextNode', '};'],
            questionType: 'single',
            answers: ['True', 'False'],
            correctAnswer: [2],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'A basic linked list node must contain two main fields, being the data and the next node. However the next node must be a pointer to another struct node rather than an integer.',
        },
        {
            questionNum: 2,
            question:
                'What fields can be found in the node of a standard linked list? (select all that apply)',
            code: [],
            questionType: 'multiple',
            answers: ['prev node', 'next node', 'data', 'list head'],
            correctAnswers: [2, 3],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'A basic linked list contains a node which has the data stored in that node and a pointer to the next node in the list. A pointer to the previous node is not kept for standard linked lists and the head is used to refer to the overall list, but not stored in individual nodes.',
        },
        {
            questionNum: 3,
            question:
                'Suppose a list has 5 elements in the form 3->5->9->2->7. What nodes must be visited to check the value at index 3? (select all that apply)',
            code: [],
            questionType: 'multiple',
            answers: ['3', '5', '9', '2', '7'],
            correctAnswers: [1, 2, 3, 4],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'All nodes before the index checked must be looked at when finding an element in the linked list.',
        },
        {
            questionNum: 4,
            question: 'What can be concluded if a node p has the value of p->next equal to NULL',
            code: [],
            questionType: 'single',
            answers: [
                'There is no data stored in the current node',
                'It is the end of the list',
                'It is the start of the list',
            ],
            correctAnswer: [2],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'A value of null will be found in the next pointer when the end of the list has been reached',
        },
        {
            questionNum: 5,
            question: 'Linked lists can only hold a predetermined amount of data',
            code: [],
            questionType: 'single',
            answers: ['True', 'False'],
            correctAnswer: [2],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'A linked list is a dynamic data type that can keep being expanded when more space is needed',
        },
        {
            questionNum: 6,
            question: 'A linked list must store its size to know the amount of nodes present',
            code: [],
            questionType: 'single',
            answers: ['True', 'False'],
            correctAnswer: [2],
            correctAnswerMessage: 'Correct answer. Good job.',
            incorrectAnswerMessage: 'Incorrect answer. Please try again.',
            explanation:
                'The number of nodes present can be found by traversing the list untill node->next==NULL',
        },
        {
            questionNum: 7,
            question: 'Describe the importance of linked lists',
            code: [],
            questionType: 'open',
            answerMessage: 'Please check the sample response',
            explanation:
                'Linked lists provide the ability to dynamically alter the amount of space needed to store varied amountes of data. An array, as an alternative, has a fixed size and once it is full more data cannot be added easily.',
        },
    ],
};
