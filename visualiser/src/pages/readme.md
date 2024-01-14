# Project Name
This project is a React.js frontend application with Redux integrated for efficient state management. The application aims to provide visualization of various data structure and algorithms, with library of Framer Motion. 

## Instructions
```javascript
npm install --force
npm run start
```
## Structure of the  application
#### Directory Structure
├── src/
│   ├── css/                
│   ├── objects/            # Drawable Objects
│   ├── parser/             # Manage conversion from backend JSON format into drawable objects
│   ├── types/              # Type definitions
│   ├── util/               # Utilities
│   ├── visualizer/         # Manage visualization for transition of individual state to another state
│   ├── stateManager.jsx    # Maintains the history of the state. 
├── package.json
└── README.md

#### Concept used in the application
State: State refers to the data structure or algorithm's representation at a particular instance, (can think of a break point on code). There's further backend state and frontend state, which refers to the data representation of the state in the backend (Python debugger) and frontend (object that can be convert to a drawable object). 

Drawable Object: The JavaScript object/class that is convertable to a JSX component be able to render in Framer Motion. 

Visualizer: The component responsible for converting Frontend State into a set of Drawable Objects, and provide visualization between each state by manage the set of Drawable Object.

Parser: The component responsible for converting Backend State into the Frontend State. 


