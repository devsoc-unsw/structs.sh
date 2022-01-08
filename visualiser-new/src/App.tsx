import { useEffect } from 'react';
import initialiseBSTVisualiser from './bst-visualiser/initialiser';
import './styles/visualiser.css';
import initialiseLinkedListVisualiser from './linked-list-visualiser/initialiser';
import './styles/visualiser.css';
import prev from './assets/prev.svg';
import curr from './assets/curr.svg';
import { topOffset, defaultSpeed } from './linked-list-visualiser/util/constants';

const App = () => {
  useEffect(() => {
    initialiseLinkedListVisualiser()
  }, []);

  return (
    <div className="container">
      <form className="row g-3">
        <div className="col-auto">
          <input id="inputValue" type="text" className="form-control" />
          <input id="altInputValue" type="text" className="form-control" />
        </div>
        <div className="col-auto">
          <button id="insertButton" type="submit" className="btn btn-danger mb-3">Insert Value!</button>
        </div>
        <div className="col-auto">
          <button id="insertButton" type="submit" className="btn btn-danger mb-3">Insert Value By Position!</button>
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
            Timeline
            <input type="range" id="timeline-slider" name="volume" min="0" max="100" /> 
        </div>
        <div className="col">
            Speed
            <input type="range" id="speed-slider" name="volume" min="0" max="1" step="0.01" defaultValue={defaultSpeed}/> 
        </div>
      </form>
      <div className="container" id="canvas">
        <div id="current" style={{top: `${topOffset}px`}}>
          <img src={curr} alt="curr arrow"/>
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
