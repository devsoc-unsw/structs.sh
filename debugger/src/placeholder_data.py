PLACEHOLDER_BACKEND_STATES = [
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x0"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 34 to the end of the list
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x2"
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "34",
                        "next": "0x0"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x2",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 56 to the end of the list
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x2"
                }
            },
            "0x2": {
                "addr": "0x2",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "34",
                        "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "56",
                        "next": "0x0"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },

    # Remove the second element from the linked list (i.e. remove 34)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "56",
                        "next": "0x0"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 72 to the start of the list (order of list nodes in heap_dict shouldn"t
    # matter as long as the next pointers are in the correct order)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x3"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "56",
                        "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "72",
                        "next": "0x1"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },

    # Append the value 21 to the second element of the linked list
    # (will be placed AFTER the second element i.e. the third element)
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x0"
                }
            },
            "0x3": {
                "addr": "0x3",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "56",
                        "next": "0x4"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "72",
                        "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "21",
                        "next": "0x3"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "72",
                        "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "21",
                        "next": "0x4"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "72",
                        "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "21",
                        "next": "0x6"
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "45",
                        "next": "0x4"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x6",
                "type": "struct node",
                "is_pointer": "true",
            }
        }
    },
    {
        'frame_info': {
            'file': 'test_linked_list.c',
            'line': '100',
            'function': 'main',
        },
        'heap_data': {
            "0x1": {
                "addr": "0x1",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "27",
                        "next": "0x0"
                }
            },
            "0x4": {
                "addr": "0x4",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "72",
                        "next": "0x1"
                }
            },
            "0x5": {
                "addr": "0x5",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "21",
                        "next": "0x6"
                }
            },
            "0x6": {
                "addr": "0x6",
                "type": "struct node",
                "is_pointer": "false",
                "data": {
                        "value": "45",
                        "next": "0x4"
                }
            }
        },
        'stack_data': {
            'curr': {
                "addr": "0x6",
                "type": "struct node",
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
