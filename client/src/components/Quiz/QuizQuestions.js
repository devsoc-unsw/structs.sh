export const quiz =  {
    "quizTitle": "Linked list quiz",
    "quizSynopsis": "Test your knowledge on linked lists with this quick refresher quiz",
    "questions": [
      {
        "question": "What fields can be found in the node of a standard linked list? (select all that apply)",
        "questionType": "text",
        "answerSelectionType": "multiple",
        "answers": [
          "prev node",
          "next node",
          "data",
          "list head"
        ],
        "correctAnswer": [2, 3],
        "messageForCorrectAnswer": "Correct answer. Good job.",
        "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
        "explanation": "A basic linked list contains a node which has the data stored in that node and a pointer to the next node in the list. A pointer to the previous node is not kept for standard linked lists and the head is used to refer to the overall list, but not stored in individual nodes.",
        "point": "10"
      },
      {
        "question": "Suppose a list has 5 elements in the form 3->5->9->2->7. What nodes must be visited to check the value at index 3? (select all that apply)",
        "questionType": "text",
        "answerSelectionType": "multiple",
        "answers": [
          "3",
          "5",
          "9",
          "2",
          "7"
        ],
        "correctAnswer": [1, 2, 3, 4],
        "messageForCorrectAnswer": "Correct answer. Good job.",
        "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
        "explanation": "All nodes before the index checked must be looked at when finding an element in the linked list.",
        "point": "10"
      },
      {
        "question": "What can be concluded if a node p has the value of p->next equal to NULL",
        "questionType": "text",
        "answerSelectionType": "single",
        "answers": [
          "There is no data stored in the current node",
          "It is the end of the list",
          "It is the start of the list"
        ],
        "correctAnswer": "2",
        "messageForCorrectAnswer": "Correct answer. Good job.",
        "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
        "explanation": "A value of null will be found in the next pointer when the end of the list has been reached",
        "point": "10"
      },
      {
        "question": "Linked lists can only hold a predetermined amount of data",
        "questionType": "text",
        "answerSelectionType": "single",
        "answers": [
          "True",
          "False"
        ],
        "correctAnswer": "2",
        "messageForCorrectAnswer": "Correct answer. Good job.",
        "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
        "explanation": "A linked list is a dynamic data type that can keep being expanded when more space is needed",
        "point": "10"
      },
      {
        "question": "A linked list must store its size to know the amount of nodes present",
        "questionType": "text",
        "answerSelectionType": "single",
        "answers": [
          "True",
          "False"
        ],
        "correctAnswer": "2",
        "messageForCorrectAnswer": "Correct answer. Good job.",
        "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
        "explanation": "The number of nodes present can be found by traversing the list untill node->next==NULL",
        "point": "10"
      },
    ]
  } 