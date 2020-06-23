# Data Structures and Algorithms
A collection of COMP2521 tutorial problems, my own examples and implementations of classic data structures and their algorithms in C.

# Table of Contents  
[Interactive BST](#interactivebst)   

<a name="interactivebst"/>
## Interactive Binary Search Tree

An interactive binary search tree builder written in C. Supports standard operations such as insertion, deletion, rotation, and in-order, pre-order, post-order and level-order printing.

### Setup Instructions:
1. `git clone https://github.com/Tymotex/DataStructures.git` - downloads this repository
2. `cd DataStructures/C/binary-tree` - navigates to the interactive BST project root
3. `make` - creates the executable file `testTree`
4. `./testTree <space separated integers>` - intially constructs a tree from the supplied sequence of integers

Eg. `./testTree 6 3 10 1 4 8 12 7 9`

### Example Usage:
<p float="left">
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/InteractiveTree1.PNG" width="50%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/InteractiveTree2.PNG" width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/InteractiveTree3.PNG" width="45%" />
  <img src="https://raw.githubusercontent.com/Tymotex/DataStructures/master/Images/InteractiveTree4.PNG" width="45%" />
</p>

### How to use this for practice:
1. Run `rm tree.c && mv tree-blank.c tree.c` to replace the main implementation file with the file containing blank functions
2. You can find all the functions that need to be implemented in the `tree.h` header file. Start by implementing the `insert` function first
3. As you implement more functions, you can test them out by running `./testTree` and then entering the relevant commands
4. If you get stuck on any function, you can check this repo for the answers

