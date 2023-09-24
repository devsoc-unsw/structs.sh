import AceEditor, { IMarker } from 'react-ace';
import 'styles/CodeEditor.css';

import 'ace-builds/src-noconflict/mode-c_cpp';

const CodeEditor = ({
  code,
  handleSetCode,
  currLine,
}: {
  code: string;
  handleSetCode: (newCode: string) => void;
  currLine: number;
}) => {
  const markers: IMarker[] = [
    {
      startRow: currLine - 1,
      startCol: 0,
      endRow: currLine - 1,
      endCol: 100,
      className: 'current-line-marker',
      type: 'fullLine',
    },
  ];

  return (
    <AceEditor
      value={code}
      onChange={handleSetCode}
      height="100%"
      width="100%"
      mode="c_cpp"
      markers={markers}
    />
  );
};

export default CodeEditor;
