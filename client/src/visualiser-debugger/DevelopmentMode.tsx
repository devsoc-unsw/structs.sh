import { useEffect, useCallback, useState, useRef } from 'react';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import Console from 'visualiser-debugger/Component/Console/Console';

// Onboarding Imports
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useMount, useSetState } from 'react-use';
import a11yChecker from 'a11y-checker';

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
import { INITIAL_BACKEND_STATE } from './Types/backendType';

// Onboarding Types
interface State {
  run: boolean;
  workspaceOpen: boolean;
  fileOpen: boolean;
  stepIndex: number;
  steps: Step[];
}

interface WorkspaceState {
  isOpen: boolean;
}

interface FileState {
  isOpen: boolean;
}

function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}

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
  };

  const handleSetCode = (newCode: string) => {
    localStorage.setItem('code', newCode);
    setCode(newCode);
  };

  const resetDebugSession = () => {
    updateNextFrame(INITIAL_BACKEND_STATE);
    setActiveSession(false);
    clearTypeDeclarations();
    clearUserAnnotation();
    setConsoleChunks([]);
  };

  const sendCode = () => {
    resetDebugSession();
    socket.socketTemp.emit('mainDebug', code);
  };

  const getNextState = () => {
    socket.socketTemp.emit('executeNext');
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
    // @ts-ignore
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

  // Onboarding Code

  const folder = useRef<HTMLDivElement>(null);

  const [{ run, workspaceOpen, fileOpen, stepIndex, steps }, setState] = useSetState<State>({
    run: false,
    workspaceOpen: false,
    fileOpen: false,
    stepIndex: 0,
    steps: [
      {
        content: <h2>Let's begin our journey!</h2>,
        placement: 'center',
        target: 'body',
      },
      {
        content: 'This is our folder, you can find everything you need here',
        target: '.folder',
        placement: 'right',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        title: 'Sidebar',
      },
    ],
  });

  useMount(() => {
    a11yChecker();
  });

  const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    
    console.log('started\n');
    setState({
      run: true,
    });
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false, stepIndex: 0 });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

    }

    logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
  };

  // Refactor to better support Debugger mode
  // - There're a lot of console.log functions, we can delegate responsibility in each component
  // - Refactor Tabs
  return (
    <div className={classNames(globalStyles.root, styles.light)}>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
      />
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          <DevelopmentModeNavbar onButtonClick={handleClickStart} />
        </div>
        <div className={classNames(styles.pane, styles.files)} style={{ overflowY: 'scroll' }} ref={folder}>
          <div className='folder'>
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
          </div>
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
