import { useEffect } from 'react';
import initialiseVisualiser from './linked-list-visualiser/linkedList';
import './styles/visualiser.css';
import prev from './assets/prev.svg';
import curr from './assets/curr.svg';
import { topOffset } from './linked-list-visualiser/svgAttributes';

const App = () => {
  useEffect(() => {
    initialiseVisualiser()
  }, []);

  return (
    <div className="container">
      <form className="row g-3">
        <div className="col-auto">
          <input id="inputValue" type="text" className="form-control" />
        </div>
        <div className="col-auto">
          <button id="appendButton" type="submit" className="btn btn-primary mb-3">Add Node!</button>
        </div>
        <div className="col-auto">
          <button id="deleteButton" type="submit" className="btn btn-danger mb-3">Delete Node!</button>
        </div>
        <div className="col-auto">
          <button id="searchButton" type="submit" className="btn btn-danger mb-3">Search by Value!</button>
        </div>
        <div className="col-auto">
          <button id="playButton" type="submit" className="btn btn-primary mb-3">Play</button>
        </div>
        <div className="col-auto">
          <button id="pauseButton" type="submit" className="btn btn-primary mb-3">Pause</button>
        </div>
        <div className="col-auto">
          <button id="previousSequenceButton" type="submit" className="btn btn-primary mb-3">Undo</button>
        </div>
        <div className="col-auto">
          <button id="nextSequenceButton" type="submit" className="btn btn-primary mb-3">Redo</button>
        </div>
        <div className="col">
            <input type="range" id="timeline-slider" name="volume" min="0" max="100" /> 
        </div>
      </form>
      <div className="container" id="canvas">
        <div id="current" style={{top: `${topOffset}px`}}>
          <img src={curr} alt="curr arrow"/>
        </div>
        <div id="prev" style={{top: `${topOffset}px`}}>
          <img src={prev} alt="prev arrow"/>
        </div>
      </div>
    </div>
  );
}

export default App;
