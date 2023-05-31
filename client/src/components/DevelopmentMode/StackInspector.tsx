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
      <colgroup>
        <col className={styles.name} />
        <col className={styles.type} />
        <col className={styles.value} />
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
      {tableRows}
      </tbody>
    </table>
  );
}

export default StackInspector;
