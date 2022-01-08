import { useEffect } from 'react';
import initialiseVisualiser from './bst-visualiser/initialiser';
import './styles/visualiser.css';

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
          <button id="insertButton" type="submit" className="btn btn-danger mb-3">Insert Value!</button>
        </div>
        <div className="col-auto">
          <button id="rotateRightButton" type="submit" className="btn btn-danger mb-3">Rotate Right Value!</button>
        </div>
        <div className="col-auto">
          <button id="playButton" type="submit" className="btn btn-primary mb-3">Play</button>
        </div>
        <div className="col-auto">
          <button id="pauseButton" type="submit" className="btn btn-primary mb-3">Pause</button>
        </div>
        <div className="col-auto">
          <button id="restartButton" type="submit" className="btn btn-danger mb-3">Restart</button>
        </div>
        <div className="col">
          <input type="range" id="timelineSlider" name="volume" min="0" max="100" defaultValue="0"/> 
        </div>
        <div className="col"> 
          <input type="range" id="speedSlider" name="volume" min="0" max="8" step="0.25" defaultValue="1"/> 
        </div>
        <div className="col-auto">
          <button id="stepBackwardsButton" type="submit" className="btn btn-primary mb-3">Step Backwards</button>
        </div>
        <div className="col-auto">
          <button id="stepForwardsButton" type="submit" className="btn btn-danger mb-3">Step Forwards</button>
        </div>
      </form>
    </div>
  );
}

export default App;
