import { useEffect } from 'react';
import initialise from './Landing';
import './Landing.css';

function App() {
  useEffect(() => {
    initialise()
  }, []);

  return (
    <div className="container">
      <form className="row g-3">
        <div className="col-auto">
          <input id="appendValue" type="text" className="form-control" />
        </div>
        <div className="col-auto">
          <button id="appendButton" type="submit" className="btn btn-primary mb-3">Add Node!</button>
        </div>
        <div className="col-auto">
          <button id="deleteButton" type="submit" className="btn btn-danger mb-3">Delete Node!</button>
        </div>
      </form>
      <div className="container" id="canvas">
        <div id="current">
          <svg width="50" height="50" > 
            <path 
              d="M21 48V2M21 2L2 19.8367M21 2L38 19.8367" 
              strokeWidth="3" 
              stroke="red"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
            </path>
          </svg>
        </div>
        <div id="prev">
          <svg width="50" height="50" > 
            <path 
              d="M21 48V2M21 2L2 19.8367M21 2L38 19.8367" 
              strokeWidth="3" 
              stroke="blue"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
            </path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default App;
