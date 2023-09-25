import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import { Socket } from 'socket.io-client';
import CodeEditor from 'components/DevelopmentMode/CodeEditor';
import StackInspector from 'components/DevelopmentMode/StackInspector';
import * as dummyData from 'components/DevelopmentMode/dummyData.json';
import Configuration from 'components/DevelopmentMode/Configuration';
import DevelopmentModeNavbar from 'components/Navbars/DevelopmentModeNavbar';
import Controls from 'components/DevelopmentMode/Controls';
import { placeholder } from 'constants/index';
import VisualizerMain from './src/VisualizerMain';
import { BackendState } from './src/visualizer-component/types/backendType';
import { useGlobalStore } from './src/visualizer-component/globalStateStore';

type ExtendedWindow = Window &
  typeof globalThis & { socket: Socket; getBreakpoints: (line: string, listName: string) => void };

const DevelopmentMode = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Attach socket to window for debugging: ', socket);
      (window as ExtendedWindow).socket = socket;
      (window as ExtendedWindow).getBreakpoints = (line: string, listName: string) =>
        socket.emit('getBreakpoints', line, listName);
    }
  }, []);
  const [backendState, setBackendState] = useState<BackendState>();
  const [activeSession, setActiveSession] = useState(false);
  const typeDeclarations = [...useGlobalStore().visualizer.typeDeclarations];
  const { updateTypeDeclaration, clearTypeDeclarations, clearUserAnnotation } = useGlobalStore();

  const updateState = (data: any) => {
    setBackendState(data);
  };

  const [code, setCode] = useState(localStorage.getItem('code') || placeholder);

  const handleSetCode = (newCode: string) => {
    localStorage.setItem('code', newCode);
    setCode(newCode);
  };

  const resetDebugSession = () => {
    setBackendState(undefined);
    setActiveSession(false);
    clearTypeDeclarations();
    clearUserAnnotation();
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

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('sendDummyLinkedListData', onSendDummyData);
    socket.on('sendDummyBinaryTreeData', onSendDummyData);
    socket.on('mainDebug', onMainDebug);
    socket.on('sendFunctionDeclaration', onSendFunctionDeclaration);
    socket.on('sendTypeDeclaration', onSendTypeDeclaration);
    socket.once('executeNext', () => {
      console.log('Executing next line...');
    });
    socket.on('sendBackendStateToUser', onSendBackendStateToUser);
    socket.on('sendStdoutToUser', onSendStdoutToUser);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('sendDummyLinkedListData', onSendDummyData);
      socket.off('sendDummyBinaryTreeData', onSendDummyData);
      socket.off('mainDebug', onMainDebug);
      socket.off('sendFunctionDeclaration', onSendFunctionDeclaration);
      socket.off('sendTypeDeclaration', onSendTypeDeclaration);
      socket.off('sendBackendStateToUser', onSendBackendStateToUser);
    };
  }, [updateState]);

  const DEBUG_MODE = false;
  return !DEBUG_MODE ? (
    <div className={classNames(globalStyles.root, styles.light)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          <DevelopmentModeNavbar />
        </div>
        <div className={classNames(styles.pane, styles.files)}>File tree</div>
        <div className={classNames(styles.pane, styles.editor)}>
          <CodeEditor
            code={code}
            handleSetCode={handleSetCode}
            currLine={backendState?.frame_info?.line_num}
          />
        </div>
        <div className={classNames(styles.pane, styles.inspector)}>
          <Tabs>
            <Tab label="Configure">
              <div className={styles.pane}>
                <Configuration typeDeclarations={typeDeclarations} />
              </div>
            </Tab>
            <Tab label="Inspect">
              <StackInspector debuggerData={dummyData} />
            </Tab>
            <Tab label="Console">
              <div className={styles.pane}>Console</div>
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
  ) : (
    <VisualizerMain backendState={backendState} />
  );
};

export default DevelopmentMode;
