import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import VisualizerMain from './src/VisualizerMain';
import { BackendState, CType } from './src/visualizer-component/types/backendType';

const DevelopmentMode = () => {
  const [backendState, setBackendState] = useState<BackendState>({
    '0x1': {
      addr: '0x1',
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        value: '27',
        next: '0x0',
      },
    },
  });

  const [count, setCountState] = useState(100);
  const onSendDummyData = (data: any) => {
    const correctedJsonString = data.replace(/'/g, '"');

    const backendStateJson = JSON.parse(correctedJsonString as string);

    // Upddate will handled in this step, rn we use backendState
    setBackendState(backendStateJson);
  };

  useEffect(() => {
    const onConnect = () => {};

    socket.on('connect', onConnect);
    socket.on('sendDummyData', onSendDummyData);

    return () => {
      socket.off('connect', onConnect);
      socket.off('sendDummyData', onSendDummyData);
    };
  }, [onSendDummyData]);

  const DEBUG_MODE = true;
  return !DEBUG_MODE ? (
    <div className={classNames(globalStyles.root, styles.dark, styles.devBody)}>
      Parser
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>Nav bar</div>
        <div className={classNames(styles.pane, styles.files)}>File tree</div>
        <div className={classNames(styles.pane, styles.editor)}>Code editor</div>
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
