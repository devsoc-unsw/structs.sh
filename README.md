# Data Structures and Algorithms &#128187;

This is a collection of implementations and interactive visualisers of classic data structures and algorithms in C.

This repository contains the backend code for the web terminal interface <strong><a href="https://www.data-structures.xyz">here</a></strong>. Use incognito mode to prevent any chrome extensions from interfering with the formatting and avoid resizing the window.

View my notes <a href="https://tymotex.github.io/DataStructures/">here</a>!

## Table of Contents

-   [Interactive Linked List](#interactive-linked-list)
-   [Interactive BST](#interactive-bst)
-   [Interactive AVL Tree](#interactive-avl)
-   [Interactive Splay Tree](#interactive-splay)
-   [Interactive Unweighted Graph (Directed and Undirected)](#interactive-unweighted-graph)
-   [Interactive Weighted Graph (Directed and Undirected)](#interactive-weighted-graph)
-   [Interactive Hash Table](#interactive-hash-table)
-   [Interactive Heap](#interactive-heap)
-   [Sorting Algorithms Benchmarker](#interactive-sort)

## Demo

Watch a video demo <strong><a href="https://www.youtube.com/watch?v=iSJL-9pe-PY">here</a></strong>.

[![TactileDS demo video](https://img.youtube.com/vi/iSJL-9pe-PY/0.jpg)](https://www.youtube.com/watch?v=iSJL-9pe-PY)

<img src="https://github.com/Tymotex/timz.dev/blob/master/public/project-images/tactile-ds-showcase.gif?raw=true"></img>

## Setup Instructions

---

<h3 style="color: yellow">
  Simple Setup for COMP2521:
</h3>

When connected to CSE servers, just copy and paste these commands onto the terminal and hit enter after pasting each one:

1. `git clone https://github.com/Tymotex/DataStructures.git && cd DataStructures`
2. `./util/scripts/make_recurse.sh`
3. You now have access to all the interactive data structures. The commands to run each of them are:
    - **_Linked Lists_:**
        1. `cd linked-list/iterative-version` or `cd linked-list/recursive-version`
        2. `./testLinkedList <space separated integers>` - initially constructs a linked list from the supplied sequence of integers. Eg. `./testLinkedList 42 10 4 20`
    - **_Binary Search Tree_:**
        1. `cd binary-tree`
        2. `./testTree <space separated integers>` - initially constructs a tree from the supplied sequence of integers. Eg. `./testTree 6 3 10 1 4 8 12 7 9`
    - **_AVL Tree_:**
        1. `cd avl-tree`
        2. `./testTree <space separated integers>` - initially constructs an AVLtree from the supplied sequence of integers. Eg. `./testTree 1 2 3 4 5 6 7`
    - **_Splay Tree_:**
        1. `cd splay-tree`
        2. `./testTree <space separated integers>` - initially constructs a splay tree from the supplied sequence of integers. Eg. `./testTree 5 3 8 7 4`
    - **_Graphs_:**
        - Unweighted
            - Undirected
                1. `cd unweighted-graph`
                2. `./testGraph <num vertices>|<input file>` - creates an empty graph with the specified number of vertices OR constructs a graph with edges specified in an input file. Eg. `./testGraph 10` or `./testGraph tests/1.in`
            - Directed
                1. `cd unweighted-digraph`
                2. `./testGraph <num vertices>|<input file>` - creates an empty graph with the specified number of vertices OR constructs a graph with edges specified in an input file. Eg. `./testGraph 10` or `./testGraph tests/1.in`
        - Weighted
            - Undirected
                1. `cd weighted-graph`
                2. `./testGraph <num vertices>|<input file>` - creates an empty graph with the specified number of vertices OR constructs a graph with edges specified in an input file. Eg. `./testGraph 10` or `./testGraph tests/1.in`
            - Directed
                1. `cd weighted-digraph`
                2. `./testGraph <num vertices>|<input file>` - creates an empty graph with the specified number of vertices OR constructs a graph with edges specified in an input file. Eg. `./testGraph 10` or `./testGraph tests/1.in`
    - **_Hash Table:_**
        1. `cd hash-table`
        2. `./testHash <size>` - creates an empty hash table with the specified size (otherwise defaults to 10 slots). Eg. `./testHash 12`
    - **_Heap:_**
        1. `cd heap`
        2. `./testHeap <size>` - creates an empty hash table with the specified size (otherwise defaults to 10 slots). Eg. `./testHeap 12`
    - **_Sorting Algorithms:_**
        1. `cd sorting-algos`
        2. Optional: generate sequences using: `./generate-tests -n <num random files> <list of sizes>`. Eg. `./generate-tests -n 5 10 100 1000`
        3. `./testSort <filename>` - takes in a file containing a sequence of numbers. Eg. `./testSort tests/random100_1` or `./testSort --silent tests/random_100_1`

---

### Setup for Development:

1. `git clone https://github.com/Tymotex/DataStructures.git && cd DataStructures` - downloads this repository and changes directory to the project root directory
2. <a href="https://computingforgeeks.com/how-to-share-your-linux-terminal-in-web-browser-with-gotty/">Install GoTTy</a>
3. Run `bundle install` in the root directory to install Ruby dependencies. See the <a href="https://bundler.io/">ruby bundler</a>. This project uses Ruby v2.7.0
4. `./util/scripts/make_recurse.sh` - recursively runs `make` on all subdirectories. This automatically compiles all the data structures
5. `ruby terminal-menu.rb` - starts the selection menu where all the interactive visualisers can be accessed

#### Web Deployment:

Instructions for testing/deploying the web-based version:

1. `sh server.sh --start` - runs the terminal sharing web service. Access at `localhost:8080`. Use `nohup sh server.sh &` to start the server as a background process
2. `sh server.sh --stop` - kills the web terminal server process

<a name="interactive-linked-list">

## Interactive Linked List

An interactive linked list builder written in C. Supports standard operations (iteratively and recursively) such as insertion, deletion, searching, sorting and reversing.

Implementation for each command is viewable in `linked-list.c` and `linked-list.h` in the `linked-list/iterative-version` and `linked-list/recursive-version` directories. View the source code <a href="https://github.com/Tymotex/DataStructures/blob/master/linked-list/iterative-version/linked-list.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/linked-list-1.png" width="100%" />
</p>

<a name="interactive-bst"/>

## Interactive Binary Search Tree

An interactive binary search tree builder written in C. Supports standard operations such as insertion, deletion, rotation, and in-order, pre-order, post-order and level-order printing.

Implementation for each command is viewable in `tree.c` and `tree.h` in the `binary-tree` directory. View the source code <a href="https://github.com/Tymotex/DataStructures/blob/master/binary-tree/tree.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/binary-tree-1.png" width="100%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/binary-tree-2.png" width="100%" />
</p>

<a name="interactive-avl"/>

## Interactive AVL Tree

An interactive AVL tree builder written in C. Supports AVL insertion, AVL deletion and commands to print the height of each node and the height balance of each node.

Implementation for each command is viewable in `tree.c` and `tree.h` in the `avl-tree` directory. View the source code <a href="https://github.com/Tymotex/DataStructures/blob/master/avl-tree/tree.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/avl-tree-1.png" width="100%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/avl-tree-2.png" width="100%" />
</p>

<a name="interactive-splay"/>

## Interactive Splay Tree

An interactive splay tree builder written in C. Splay trees differ from regular BSTs in that searching and inserting a value involves bringing the target/inserted node to the root.

Implementation for each command is viewable in `tree.c` and `tree.h` in the `splay-tree` directory. View the source code <a href="https://github.com/Tymotex/DataStructures/blob/master/splay-tree/tree.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/splay-tree-1.png" width="100%" />
</p>

<a name="interactive-unweighted-graph"/>

## Interactive Unweighted Graphs

Interactive unweighted directed/undirected graph builder written in C.

Implementation for each command is viewable in `graph.c`, `graph.h`, `graph-algos.c` and `graph-algos.h` in the `unweighted-graph` and `unweighted-digraph` directories.

-   View source code for unweighted graphs <a href="https://github.com/Tymotex/DataStructures/tree/master/unweighted-graph/graph-algos.c">algorithms here</a> and <a href="https://github.com/Tymotex/DataStructures/blob/master/unweighted-graph/graph.c">basic functions here</a>
-   View source code for unweighted digraphs <a href="https://github.com/Tymotex/DataStructures/blob/master/unweighted-digraph/graph-algos.c">algorithms here</a> and <a href="https://github.com/Tymotex/DataStructures/blob/master/unweighted-digraph/graph.c">basic functions here</a>

### Example Usage:

#### Digraph:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/unweighted-digraph-1.png" width="100%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/unweighted-digraph-2.png" width="100%" />
</p>

#### Undirected Graph:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/unweighted-graph-1.png" width="100%" />
</p>

<a name="interactive-weighted-graph"/>

## Interactive Weighted Graphs

Interactive weighted directed/undirected graph builder written in C. Implements Dijkstra's algorithm for determining a single source spanning tree.

Implementation for each command is viewable in `graph.c`, `graph.h`, `graph-algos.c`, `graph-algos.h`, `dijkstra.c` and `dijkstra.h` in the `weighted-graph` and `weighted-digraph` directories.

-   View source code for weighted graphs <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-graph/graph-algos.c">algorithms here</a>, <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-graph/graph.c">basic functions here</a> and <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-graph/dijkstra.c">Dijkstra's algorithm here</a>
-   View source code for weighted digraphs <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-digraph/graph-algos.c">algorithms here</a>, <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-digraph/graph.c">basic functions here</a> and <a href="https://github.com/Tymotex/DataStructures/blob/master/weighted-digraph/dijkstra.c">Dijkstra's algorithm here</a>

### Example Usage:

#### Digraph:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/weighted-digraph-1.png" width="100%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/weighted-digraph-2.png" width="42%" />
</p>

#### Undirected Graph:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/weighted-graph-1.png" width="100%" />
</p>

<a name="interactive-hash"/>

## Interactive Hash Table (Lookup Table)

Interactive hash table written in C for storing key-value pairs.

Implementation for each command is viewable in `hash-table.c` and `hash-table.h` in the `hash-table` directory. View source code <a href="https://github.com/Tymotex/DataStructures/tree/master/hash-table">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/hash-1.png" width="100%" />
</p>

<a name="interactive-heap"/>

## Interactive Heap

Interactive max heap table written in C.

Implementation for each command is viewable in `heap.c` and `heap.h` in the `heap` directory. View source code <a href="https://github.com/Tymotex/DataStructures/blob/master/heap/heap.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/heap-1.png" width="100%" />
</p>

<a name="interactive-sort"/>

## Interactive Sorting Algorithms

A collection of classic sort algorithms written in C. Timing data is shown for each sort algorithm used.

Implementation for each command is viewable in `sort.c` and `sort.h` in the `sorting-algos` directory. View source code <a href="https://github.com/Tymotex/DataStructures/blob/master/sorting-algos/sort.c">here</a>.

### Example Usage:

<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/showcase/sort-1.png" width="100%" />
</p>
