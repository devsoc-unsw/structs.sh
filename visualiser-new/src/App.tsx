import { useEffect } from 'react';
import initialiseVisualiser from './bst-visualiser/bst';
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
