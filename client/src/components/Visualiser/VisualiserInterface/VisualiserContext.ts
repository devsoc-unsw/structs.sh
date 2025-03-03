import React from 'react';
import VisualiserController from 'visualiser-src/controller/VisualiserController';

interface VisualiserContextValues {
  controller: VisualiserController;
}

const VisualiserContext = React.createContext<VisualiserContextValues>(null!);

export default VisualiserContext;
