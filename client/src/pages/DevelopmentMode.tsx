import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import { Socket } from 'socket.io-client';
import VisualizerMain from './src/VisualizerMain';
import { BackendState, CType } from './src/visualizer-component/types/backendType';
import CodeEditor from 'components/DevelopmentMode/CodeEditor';

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
    heap: {
      '0x1': {
        addr: '0x1',
        type: CType.SINGLE_LINED_LIST_NODE,
        is_pointer: false,
        data: {
          value: '27',
          next: '0x0',
        },
      },
    },
    stack: {},
  });

  const [count, setCountState] = useState(100);

  const onDisconnect = useCallback(() => {
    console.log('Disconnected!');
  }, []);

  const onMainDebug = useCallback((data: any) => {
    console.log(`Received event onMainDebug:\n`, data);
  }, []);

  const onSendFunctionDeclaration = useCallback((data: any) => {
    console.log(`Received function declaration:\n`, data);
  }, []);

  const onSendTypeDeclaration = useCallback((data: any) => {
    console.log(`Received type declaration:\n`, data);
  }, []);

  const onSendDummyData = (data: any) => {
    // Upddate will handled in this step, rn we use backendState
    console.log('received dummy data:', data);
    setBackendState(data);
  };
  const onSendDummyArrayData = (data: any) => {
    console.log('received dummy array data:', data);
    setBackendState(data);
  };

  const onGetBreakpoints = useCallback((data: any) => {
    console.log(`Received data:\n`, data);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');

      socket.emit('mainDebug');

      // === Uncomment these socket.emit() calls to emit event to
      // === the server and get the response in corresponding event handlers
      // === defined above.

      // socket.emit('getBreakpoints', '121', 'list2');
      // socket.emit('getBreakpoints', '122', 'list2');
      // socket.emit('getBreakpoints', '123', 'list2');
      // socket.emit('getBreakpoints', '124', 'list2');
      // socket.emit('getBreakpoints', '125', 'list2');
      // socket.emit('getBreakpoints', '126', 'list2');

      // socket.emit('sendDummyData', '100');
      // socket.emit('sendDummyData', '101');
      // socket.emit('sendDummyData', '102');
      // socket.emit('sendDummyData', '103');
      // socket.emit('sendDummyData', '104');
      // socket.emit('sendDummyData', '105');

      // socket.emit('sendDummyArrayData', 2);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('mainDebug', onMainDebug);
    socket.on('sendFunctionDeclaration', onSendFunctionDeclaration);
    socket.on('sendTypeDeclaration', onSendTypeDeclaration);
    socket.on('getBreakpoints', onGetBreakpoints);
    socket.on('sendDummyData', onSendDummyData);
    socket.on('sendDummyArrayData', onSendDummyArrayData);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('mainDebug', onMainDebug);
      socket.off('sendFunctionDeclaration', onSendFunctionDeclaration);
      socket.off('sendTypeDeclaration', onSendTypeDeclaration);
      socket.off('getBreakpoints', onGetBreakpoints);
      socket.off('sendDummyData', onSendDummyData);
      socket.off('sendDummyArrayData', onSendDummyArrayData);
    };
  }, [
    onSendDummyData,
    onSendDummyArrayData,
    onDisconnect,
    onMainDebug,
    onSendFunctionDeclaration,
    onSendTypeDeclaration,
    onGetBreakpoints,
  ]);

  const DEBUG_MODE = false;
  return !DEBUG_MODE ? (
    <div className={classNames(globalStyles.root, styles.light)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>Nav bar</div>
        <div className={classNames(styles.pane, styles.files)}>File tree</div>
        <div className={classNames(styles.pane, styles.editor)}>
          <CodeEditor />
        </div>
        <div className={classNames(styles.pane, styles.inspector)}>
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
            getNextState={() => {
              socket.emit('sendDummyData', count.toString());
              setCountState(count + 1);
            }}
          />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>Timeline</div>
      </div>
    </div>
  ) : (
    <VisualizerMain
      backendState={backendState}
      getNextState={() => {
        socket.emit('sendDummyData', count.toString());
        setCountState(count + 1);
      }}
    />
  );
};

export default DevelopmentMode;
