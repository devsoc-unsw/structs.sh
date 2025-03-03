import AceEditor, { IMarker } from 'react-ace';
import 'styles/CodeEditor.css';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useState, useEffect } from 'react';
import { onboardingStore } from 'visualiser-debugger/Store/onboardingStore';
import { useUserFsStateStore } from '../../Store/userFsStateStore';
import { IFileFileNode } from '../FileTree/FS/IFileSystem';
import { useFrontendStateStore } from '../../Store/frontendStateStore';

const CodeEditor: React.FC = () => {
  const currBackendState = useFrontendStateStore((store) => {
    return store.currState().backendState;
  });
  const { fileSystem, currFocusFilePath } = useUserFsStateStore();
  const { setOnboardingCurrFile } = onboardingStore();
  const [currFile, setCurrFile] = useState<IFileFileNode | undefined>(undefined);
  const [code, setCode] = useState('');

  useEffect(() => {
    // Update currFile based on currFocusFilePath
    const file = fileSystem.getFileFromPath(currFocusFilePath) as IFileFileNode;
    setOnboardingCurrFile(file.name);
    setCurrFile(file);
    setCode(file?.data || '');
  }, [currFocusFilePath, fileSystem]);

  const markers: IMarker[] = [
    {
      startRow: currBackendState.frame_info.line_num - 1,
      startCol: 0,
      endRow: currBackendState.frame_info.line_num - 1,
      endCol: 100,
      className: 'current-line-marker',
      type: 'fullLine',
    },
  ];

  // Function to handle code changes from the editor
  const handleSetCode = (newCode: string) => {
    if (currFile && currFile.data !== newCode) {
      currFile.data = newCode;
      fileSystem.saveChanges();
      setCode(newCode);
    }
  };

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
