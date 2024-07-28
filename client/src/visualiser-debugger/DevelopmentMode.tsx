import { useRef, useState } from 'react';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import Console from 'visualiser-debugger/Component/Console/Console';
import DevelopmentModeNavbar from '../components/Navbars/DevelopmentModeNavbar';
import Configuration from './Component/Configuration/Configuration';
import Controls from './Component/Control/Controls';
import CodeEditor from './Component/CodeEditor/CodeEditor';
import StackInspector from './Component/StackInspector/StackInspector';
import VisualizerMain from './Component/VisualizerMain';
import FileManager from './Component/FileTree/FileManager';
import { useGlobalStore } from './Store/globalStateStore';
import { useSocketCommunication } from '../Services/useSocketCommunication';
import AboutText from './Component/FileTree/AboutText';
import { useUserFsStateStore } from './Store/userFsStateStore';

const DevelopmentMode = () => {
  const {
    updateNextFrame,
    updateTypeDeclaration,
    clearTypeDeclarations,
    clearUserAnnotation,
    currFrame,
  } = useGlobalStore();

  const { fileSystem, currFocusFilePath } = useUserFsStateStore();
  const [tab, setTab] = useState('0');
  const inputElement = useRef(null);
  const { activeSession, consoleChunks, setConsoleChunks, sendCode, getNextState } =
    useSocketCommunication({
      updateNextFrame,
      updateTypeDeclaration,
      clearTypeDeclarations,
      clearUserAnnotation,
      setTab,
    });

  const handleChangeTab = (newTabValue) => {
    setTab(newTabValue);
  };

  const handleAddConsoleChunk = (chunk) => {
    setConsoleChunks([...consoleChunks, chunk]);
  };

  const scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Send code using the hook's sendCode function, passing necessary parameters
  const handleSendCode = () => {
    sendCode(fileSystem, currFocusFilePath);
  };

  return (
    <div className={classNames(globalStyles.root, styles.light)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          <DevelopmentModeNavbar />
        </div>
        <div className={classNames(styles.pane, styles.files)} style={{ overflowY: 'scroll' }}>
          <FileManager />
          <div
            style={{
              fontSize: 'small',
              marginTop: '1.6rem',
              color: 'rgb(85, 85, 85)',
            }}
          />
        </div>
        <div className={classNames(styles.pane, styles.editor)}>
          <CodeEditor currLine={currFrame?.frame_info?.line_num} />
        </div>
        <div className={classNames(styles.pane, styles.inspector)}>
          <Tabs value={tab} onValueChange={handleChangeTab}>
            <Tab label="Configure">
              <Configuration />
            </Tab>
            <Tab label="Inspect">
              <StackInspector />
            </Tab>
            <Tab label="Console">
              <Console
                chunks={consoleChunks}
                handleAddChunk={handleAddConsoleChunk}
                scrollToBottom={scrollToBottom}
                isActive={activeSession}
              />
            </Tab>
          </Tabs>
        </div>
        <div className={classNames(styles.pane, styles.visualiser)}>
          <VisualizerMain backendState={currFrame} />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          <Controls
            getNextState={getNextState}
            sendCode={handleSendCode}
            activeSession={activeSession}
          />
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
