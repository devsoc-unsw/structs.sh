PLACEHOLDER_BACKEND_STATES_LINKED_LIST = [
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 11,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x1",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x1",
                "typeName": "struct node*",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 34 to the end of the list
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 11,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x2",
                    }
                },
                "addr": "0x1",
            },
            "0x2": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 34,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x2",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x2",
                "typeName": "struct node*",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 56 to the end of the list
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 11,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x2",
                    }
                },
                "addr": "0x1",
            },
            "0x2": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 34,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x3",
                    }
                },
                "addr": "0x2",
            },
            "0x3": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 56,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x3",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x3",
                "typeName": "struct node*",
                "is_pointer": "true",
            }
        }
    },

    # Remove the second element from the linked list (i.e. remove 34)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 11,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x3",
                    }
                },
                "addr": "0x1",
            },
            "0x3": {
                "typeName": "struct node",
                "value": {
                    "data": {
                        "typeName": "int",
                        "value": 56,
                    },
                    "next": {
                        "typeName": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x3",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x3",
                "typeName": "struct node*",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 72 to the start of the list (order of list nodes in heap_dict shouldn"t
    # matter as long as the next pointers are in the correct order)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 11,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x3",
                    }
                },
                "addr": "0x1",
            },
            "0x3": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 56,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x3",
            },
            "0x4": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 72,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x1",
                    }
                },
                "addr": "0x4",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x4",
                "type": "struct node*",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 21 to the second element of the linked list
    # (will be placed AFTER the second element i.e. the third element)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line_num': '100',
            'line': 'printf("Hello world!");',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 11,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x3",
                    }
                },
                "addr": "0x1",
            },
            "0x3": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 56,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x0",
                    }
                },
                "addr": "0x3",
            },
            "0x4": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 72,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x5",
                    }
                },
                "addr": "0x4",
            },
            "0x5": {
                "type": "struct node",
                "value": {
                    "data": {
                        "type": "int",
                        "value": 21,
                    },
                    "next": {
                        "type": "struct node*",
                        "value": "0x1",
                    }
                },
                "addr": "0x5",
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x5",
                "type": "struct node*",
                "is_pointer": "true",
            }
        }
    },
]

PLACEHOLDER_BACKEND_STATES_BINARY_TREE = [
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    },
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x4",
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "50",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    },
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x5",
                    "right": "0x0",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x4",
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                    "value": "50",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "10",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    },
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x5",
                    "right": "0x6",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x4",
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "50",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "10",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    },
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x5",
                    "right": "0x6",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x4",
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "50",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "10",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x7",
                    "right": "0x0",
                }
            },
            "0x7": {
                "addr": "0x7",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x9",
                    "right": "0x8",
                }
            },
            "0x8": {
                "addr": "0x8",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x9": {
                "addr": "0x9",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    },
    {
        'heap': {
            "0x1": {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "27",
                    "left": "0x2",
                    "right": "0x3",
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "15",
                    "left": "0x5",
                    "right": "0x6",
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "35",
                    "left": "0x0",
                    "right": "0x4",
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "50",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "10",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x7",
                    "right": "0x8",
                }
            },
            "0x7": {
                "addr": "0x7",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x0",
                }
            },
            "0x8": {
                "addr": "0x8",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x9",
                }
            },
            "0x9": {
                "addr": "0x9",
                "type": "struct tree_node",
                "is_pointer": "false",
                "data": {
                    "value": "20",
                    "left": "0x0",
                    "right": "0x0",
                }
            }
        },
        'stack': {
            'root': {
                "addr": "0x1",
                "type": "struct tree_node",
                "is_pointer": "true",
            }
        }
    }
]
PLACEHOLDER_LINKED_LIST_NODES = [
    {
        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x0'
            }
        }
    }, {     # Append the value 34 to the end of the list
        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x2'
            }
        },
        '0x2': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '34',
                    'next': '0x0'
            }
        }
    }, {    # Append the value 56 to the end of the list

        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x2'
            }
        },
        '0x2': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '34',
                    'next': '0x3'
            }
        },
        '0x3': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '56',
                    'next': '0x0'
            }
        }
    }, {    # Remove the second element from the linked list (i.e. remove 34)

        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x3'
            }
        },
        '0x3': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '56',
                    'next': '0x0'
            }
        }
    }, {
        # Append the value 72 to the start of the list (order of list nodes in heap_dict shouldn't
        # matter as long as the next pointers are in the correct order)

        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x3'
            }
        },
        '0x3': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '56',
                    'next': '0x0'
            }
        },
        '0x4': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '72',
                    'next': '0x1'
            }
        }
    }, {    # Append the value 21 to the second element of the linked list
        # (will be placed AFTER the second element i.e. the third element)

        '0x1': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '27',
                    'next': '0x5'
            }
        },
        '0x3': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '56',
                    'next': '0x0'
            }
        },
        '0x4': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '72',
                    'next': '0x1'
            }
        },
        '0x5': {
            'type': 'struct node',
            'is_pointer': 'false',
            'data': {
                    'value': '21',
                    'next': '0x3'
            }
        }
    }
]
