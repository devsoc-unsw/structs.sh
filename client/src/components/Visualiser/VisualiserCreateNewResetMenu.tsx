import React from 'react';

/**
 * A space for buttons which call higher level operatons on the data structure, currently reset or create new randomly generated.
 */
 const VisualiserCreateNewResetMenu: React.FC = () => (
    <span
      id="visualiser-create-new-reset-menu"
      style={{ position: 'absolute', height: '50px', width: '200px', top: '20px', right: '20px', background: 'rgba(200, 200, 200)'}}
    >
     <button type="button">Create New</button>
     <button type="button">Reset</button>
    </span>
  );

export default VisualiserCreateNewResetMenu;
