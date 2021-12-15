import { useEffect } from 'react';
import initialiseVisualiser from './bst-visualiser/initialiser';
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
          <button id="insertButton" type="submit" className="btn btn-danger mb-3">Insert Value!</button>
        </div>
      </form>
    </div>
  );
}

export default App;
