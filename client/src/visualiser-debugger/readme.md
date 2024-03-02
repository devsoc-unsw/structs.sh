# Project Name
The Frontend part of visualize-debugger. The project that transfer user's C program into interactive visualization. 

A react project for converting GDB related instance data (as called state) maps to a visualization. 

## High Level Concept in this Project
1. Declarative over Imperative
   1. One of the key reason we choose to shift from D3 to framer motion is, it's an impossible task to create animation for user's C program. There're infinite possibility, patterns. 
   2. Framer motion serve as a great library for declarative visualization, the core idea is to visualize any user's C program state, and transition between two state without any assumption on user. 
2. Emphasis on TypeScript
   1. This may not be a common frontend pattern, to see such aggressive use case of typescript, but this project is not a norm frontend project. I would call it the 'Figma' frontend. 

## Structure of the  application
### File Structure
```
├── Component
    ├── CodeEditor
    ├── Configuration
    ├── Control
    ├── FileTree
    ├── StackInspector
    ├── Visualizer
├── Store
├── Types
```

### Concept used in the application

#### State
State: State refers any instance of user's c code, (think of a break point, user's C code's stack of frame). 
- Backend State: the data representation of the state in the backend (Python debugger).
- Frontend state:  the data representation of frontend visualization. Eg. A collection of drawable objects.


#### Entity
Entity: The lowest unit of logic that serve visualization purpose. 
BaseEntity: The definition of entity. (The below two type applies on top of BaseEntity)
CoreEntity: The categorize entity that provide a decorative functionality to BaseEntity. 
DrawableEntity: The entity that is capable of responsible for generate lowest unit of visualization in Visualizer layer.

#### Visualizer
Visualizer: The component responsible for converting Frontend State into a set of Drawable Objects, and provide visualization between each state by manage the set of Drawable Object.

#### Parser
Parser: The component responsible for converting Backend State into the Frontend State. 


