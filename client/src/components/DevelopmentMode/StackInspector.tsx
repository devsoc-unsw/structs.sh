import React from "react";
import styles from "./StackInspector.module.scss";

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
      
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Value</th>
      </tr>
      {tableRows}
    </table>
  );
}

export default StackInspector;
