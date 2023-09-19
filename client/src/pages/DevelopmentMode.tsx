import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import { Socket } from 'socket.io-client';
import CodeEditor from 'components/DevelopmentMode/CodeEditor';
import VisualizerMain from './src/VisualizerMain';
import { BackendState, CType } from './src/visualizer-component/types/backendType';

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
  const [backendState, setBackendState] = useState<BackendState>({
    frame_info: {
      file: 'test.c',
      line_num: 12,
      line: 'printf("Hello World!");',
      function: 'main',
    },
    stack_data: {},
    heap_data: {},
  });

  const [editorCollapsed, setEditorCollapsed] = useState(true);

  const [count, setCountState] = useState(100);
  const updateState = (data: any) => {
    console.log('Update backendState:', data);
    setBackendState(data);
  };

  const onGetBreakpoints = useCallback((data: any) => {
    // console.log(`Received data:\n`, data);
  }, []);

  const onDisconnect = useCallback(() => {
    // console.log('Disconnected!');
  }, []);

  const onSendDummyData = useCallback((data: any) => {
    if (data !== 'LINE NOT FOUND') {
      updateState(data);
      setCountState(count + 1);
    } else {
      console.log('!!! No more dummy data');
    }
  }, []);

  const onMainDebug = useCallback((data: any) => {
    // console.log(`Received event onMainDebug:\n`, data);
  }, []);

  const onSendFunctionDeclaration = useCallback((data: any) => {
    // console.log(`Received function declaration:\n`, data);
  }, []);

  const onSendTypeDeclaration = useCallback((data: any) => {
    // console.log(`Received type declaration:\n`, data);
  }, []);

  const onSendBackendStateToUser = useCallback((data: any) => {
    console.log(`Received backend state:\n`, data);
    // Can't use real debugger backend state yet, not in the right format
    // updateState(data);
  }, []);

  const onSendStdoutToUser = useCallback((data: any) => {
    console.log(`Received program stdout:\n`, data);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
      socket.emit('mainDebug');
      socket.emit('executeNext');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('getBreakpoints', onGetBreakpoints);
    socket.on('sendDummyLinkedListData', onSendDummyData);
    socket.on('sendDummyBinaryTreeData', onSendDummyData);
    socket.on('mainDebug', onMainDebug);
    socket.on('sendFunctionDeclaration', onSendFunctionDeclaration);
    socket.on('sendTypeDeclaration', onSendTypeDeclaration);
    socket.on('executeNext', () => {
      // console.log('Executing next line...');
    });
    socket.on('sendBackendStateToUser', onSendBackendStateToUser);
    socket.on('sendStdoutToUser', onSendStdoutToUser);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('getBreakpoints', onGetBreakpoints);
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
        <div className={classNames(styles.pane, styles.nav)}>Nav bar</div>
        <div className={classNames(styles.pane, styles.files)}>File tree</div>
        <div
          className={classNames(
            styles.pane,
            styles.editor,
            editorCollapsed && styles.editorCollapsed
          )}
        >
          <CodeEditor />
        </div>
        <div
          className={classNames(
            styles.pane,
            styles.inspector,
            editorCollapsed && styles.inspectorExpanded
          )}
        >
          <Tabs>
            <Tab label="Console">
              <div className={styles.pane}>Console</div>
            </Tab>
            <Tab label="Inspect">
              <div className={styles.pane}>Inspect</div>
            </Tab>
            <Tab label="Configure">
              <div className={styles.pane}>Configure</div>
            </Tab>
          </Tabs>
        </div>
        <div className={classNames(styles.pane, styles.visualiser)}>
          <VisualizerMain
            backendState={backendState}
            getDummyNextState={() => {
              socket.emit('sendDummyLinkedListData', count);
            }}
            getNextState={() => {
              socket.emit('executeNext');
            }}
          />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>Timeline</div>
      </div>
    </div>
  ) : (
    <VisualizerMain
      backendState={backendState}
      getDummyNextState={() => {
        socket.emit('sendDummyLinkedListData', count);
      }}
      getNextState={() => {
        socket.emit('executeNext');
      }}
    />
  );
};

export default DevelopmentMode;
