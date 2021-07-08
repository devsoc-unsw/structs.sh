import React, { useEffect } from 'react';
import LinkedListAnimation from './Animation/LinkedList/linkedListAnimation';

function App() {
  useEffect(() => {
    const list = new LinkedListAnimation();
  }, []);

  return (
    <div classname="App">
      <header classname="App-header">
        <form className="list-append-form">
          <input name="value" placeholder="number to append" />
          <button type="submit" name="append">append</button>
        </form>
        <form className="list-delete-form">
          <input name="index" placeholder="position to delete" />
          <button type="submit" name="delete">delete </button>
        </form>
        <div className="visualiser">
          <svg className="visualiser-svg" overflow="auto" style={{ width: '100%' }}>
            <g className="nodes" transform="translate(0, 20)" />
            <g className="pointers" transform="translate(0, 20)" />
          </svg>
        </div>
      </header >
    </div >
  );
}

export default App;
