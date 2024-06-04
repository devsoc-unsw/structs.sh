import { useEffect, useCallback, useState, useRef } from 'react';
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
import { useGlobalStore } from './Store/globalStateStore';
import VisualizerMain from './Component/VisualizerMain';
import AboutText from './Component/FileTree/AboutText';
import WorkspaceSelector from './Component/FileTree/WorkspaceSelector';
import {
  PLACEHOLDER_USERNAME,
  PLACEHOLDER_WORKSPACE,
  loadCode,
} from './Component/FileTree/Util/util';
import useSocketClientStore from '../Services/socketClient';

const DevelopmentMode = () => {
  const socket = useSocketClientStore((stateStore) => stateStore.socket);
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const {
    currFrame: backendState,
    updateTypeDeclaration,
    clearTypeDeclarations,
    clearUserAnnotation,
    updateNextFrame,
  } = useGlobalStore();

  const [activeSession, setActiveSession] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(PLACEHOLDER_WORKSPACE);
  const [programName, setProgramName] = useState('');
  const [code, setCode] = useState('');
  const [consoleChunks, setConsoleChunks] = useState([]);

  // Tab values correspond to their index
  // ('Configure' has value '0', 'Inspect' has value '1', 'Console' has value '2')
  // David's comment: Why do we use a number instead of string, string seems much more intuitive to code
  const [tab, setTab] = useState('0');

  const inputElement = useRef(null);

  const scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleAddConsoleChunk = (chunk) => {
    setConsoleChunks((oldChunks) => [...oldChunks, chunk]);
  };

  const handleChangeTab = (newTabValue: string) => {
    setTab(newTabValue);
  };

  const updateState = (data: any) => {
    updateNextFrame(data);
    updateNextFrame(data);
  };

  const handleSetCode = (newCode: string) => {
    localStorage.setItem('code', newCode);
    setCode(newCode);
  };

  const resetDebugSession = () => {
    updateNextFrame(undefined);
    setActiveSession(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    setConsoleChunks([]);
  };

  const sendCode = () => {
    resetDebugSession();
    socket.emit('mainDebug', code);
  };

  const getNextState = () => {
    socket.emit('executeNext');
  };

  const onDisconnect = useCallback(() => {
    console.log('Disconnected!');
  }, []);

  const onSendDummyData = useCallback((data: any) => {
    console.log(`Received dummy data:\n`, data);
    if (data !== 'LINE NOT FOUND') {
      updateState(data);
    } else {
      console.log('!!! No more dummy data');
    }
  }, []);

  const onMainDebug = useCallback((data: any) => {
    console.log(`Received event onMainDebug:\n`, data);
    setActiveSession(true);
  }, []);

  const onSendFunctionDeclaration = useCallback((data: any) => {
    console.log(`Received function declaration:\n`, data);
  }, []);

  const onSendTypeDeclaration = useCallback((data: any) => {
    console.log(`Received type declaration:\n`, data);
    updateTypeDeclaration(data);
  }, []);

  const onSendBackendStateToUser = useCallback((data: any) => {
    console.log(`Received backend state:\n`, data);
    updateState(data);
  }, []);

  const onSendStdoutToUser = useCallback((data: any) => {
    console.log(`Received program stdout:\n`, data);
  }, []);

  const onExecuteNext = useCallback(() => {
    console.log('Executing next line...');
  }, []);

  const onProgramWaitingForInput = useCallback((data: any) => {
    console.log(`Event received from debugger: program is waiting for input\n`, data);
  }, []);

  const onCompileError = (data: any) => {
    console.log('Received compilation error:\n', data);
    // On a compilation error, switch the tab to 'Console' so the user can see the error
    setConsoleChunks([data]);
    setTab('2');
  };

  const onStdout = (data: string) => {
    setConsoleChunks((oldChunks) => [...oldChunks, data]);
    scrollToBottom();
  };

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
    };

    // Question to myself: Do we actually need all those connections?
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('sendDummyLinkedListData', onSendDummyData);
    socket.on('sendDummyBinaryTreeData', onSendDummyData);
    socket.on('mainDebug', onMainDebug);
    socket.on('sendFunctionDeclaration', onSendFunctionDeclaration);
    socket.on('sendTypeDeclaration', onSendTypeDeclaration);
    socket.on('executeNext', onExecuteNext);
    socket.on('sendBackendStateToUser', onSendBackendStateToUser);
    socket.on('sendStdoutToUser', onSendStdoutToUser);
    socket.on('programWaitingForInput', onProgramWaitingForInput);
    socket.on('compileError', onCompileError);
    socket.on('sendStdoutToUser', onStdout);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('sendDummyLinkedListData', onSendDummyData);
      socket.off('sendDummyBinaryTreeData', onSendDummyData);
      socket.off('mainDebug', onMainDebug);
      socket.off('executeNext', onExecuteNext);
      socket.off('sendFunctionDeclaration', onSendFunctionDeclaration);
      socket.off('sendTypeDeclaration', onSendTypeDeclaration);
      socket.off('sendBackendStateToUser', onSendBackendStateToUser);
      socket.off('programWaitingForInput', onProgramWaitingForInput);
      socket.off('sendStdoutToUser', onSendStdoutToUser);
      socket.off('compileError', onCompileError);
      socket.off('sendStdoutToUser', onStdout);
    };
  }, []);

  // Refactor to better support Debugger mode
  // - There're a lot of console.log functions, we can delegate responsibility in each component
  // - Refactor Tabs
  return (
    <div className={classNames(globalStyles.root, styles.light)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          <DevelopmentModeNavbar />
        </div>
        <div className={classNames(styles.pane, styles.files)} style={{ overflowY: 'scroll' }}>
          <WorkspaceSelector
            programName={programName}
            onChangeWorkspaceName={(newWorkspaceName: string) => {
              setWorkspaceName(newWorkspaceName);
            }}
            onChangeProgramName={async (newProgramName: string) => {
              setProgramName(newProgramName);
              handleSetCode(await loadCode(newProgramName, PLACEHOLDER_USERNAME, workspaceName));
            }}
          />
          <div
            style={{
              fontSize: 'small',
              marginTop: '1.6rem',
              color: 'rgb(85, 85, 85)',
            }}
          >
            <AboutText />
          </div>
        </div>
        <div className={classNames(styles.pane, styles.editor)}>
          <CodeEditor
            programName={programName}
            workspaceName={workspaceName}
            code={code}
            handleSetCode={handleSetCode}
            currLine={backendState?.frame_info?.line_num}
          />
        </div>
        <div className={classNames(styles.pane, styles.inspector)}>
          <Tabs value={tab} onValueChange={handleChangeTab}>
            <Tab label="Configure">
              <div className={classNames(styles.pane)} style={{ overflow: 'scroll' }}>
                <Configuration />
              </div>
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
          <VisualizerMain backendState={backendState} />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          <Controls getNextState={getNextState} sendCode={sendCode} activeSession={activeSession} />
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
