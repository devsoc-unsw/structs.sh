import React from "react";

function StackInspector({debuggerData}) {
  const tableRows = debuggerData.map((variable) => (
    <tr>
      <td>{variable.name}</td>
      <td>{variable.type}</td>
      <td>{variable.value}</td>
    </tr>
  ));

  return (
    // table version -- should be replaced with nested dropdown version later
    <table>
      <tr className="table-header">
        <td>Name</td>
        <td>Type</td>
        <td>Value</td>
      </tr>
      {tableRows}
    </table>
  );
}

export default StackInspector;
