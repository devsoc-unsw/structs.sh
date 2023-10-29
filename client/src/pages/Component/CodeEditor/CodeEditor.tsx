import AceEditor, { IMarker } from 'react-ace';
import 'styles/CodeEditor.css';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';

const CodeEditor = ({
  programName,
  workspaceName,
  code,
  handleSetCode,
  currLine = 0,
}: {
  programName: string;
  workspaceName: string;
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

  if (programName != '') {
    const loadCode = () => {
      axios.get(SERVER_URL + '/api/retrieveFile', {
        params: {
          username: 'benp123',
          workspace: workspaceName,
          filename: programName,
        }
      }).then((response) => {
        if (response.data.hasOwnProperty('error')) {
          console.log("ERROR: ", + response.data.error)
          return "";
        }

        return response.data.content;
      });

      return "";
    }

    // TODO: add workspace
    const changeCode = (newCode: string) => {
      const data = {
        username: 'benp123',
        workspace: workspaceName,
        filename: programName,
        fileData: code
      };

      axios.post(SERVER_URL + '/api/saveFile', data).then((response) => {
        if (response.data.hasOwnProperty('error')) {
          console.log("ERROR: ", + response.data.error)
        }
      });

      handleSetCode(newCode);
    }

    if (code != loadCode()) {
      console.log(programName)
      changeCode(code);
    }
  }

  return (
    <AceEditor
      value={code}
      onChange={handleSetCode}
      mode="c_cpp"
      theme="tomorrow"
      height="100%"
      width="100%"
      markers={markers}
      enableSnippets
      enableLiveAutocompletion
      enableBasicAutocompletion
    />
  );
};

export default CodeEditor;
