import { useEffect, useCallback, useState } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import VisualizerMain from './src/VisualizerMain';
import { BackendState, BackendUpdate } from './src/visualizer-component/types/graphState';

const DevelopmentMode = () => {
  const [backendState, setBackendState] = useState<BackendState>({});
  const [backendUpate, setBackendUpdate] = useState<BackendUpdate>({
    modified: {},
    removed: [],
  });

  const [count, setCountState] = useState(100);
  const onSendDummyData = useCallback((data: any) => {
    const correctedJsonString = data.replace(/'/g, '"');
    console.log(correctedJsonString);

    const backendStateJson = JSON.parse(correctedJsonString as string);

    // Upddate will handled in this step, rn we use backendState
    setBackendState(backendStateJson);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
    };

    socket.on('connect', onConnect);
    socket.on('sendDummyData', onSendDummyData);

    return () => {
      socket.off('connect', onConnect);
      socket.off('sendDummyData', onSendDummyData);
    };
  }, [onSendDummyData]);

  return (
    <div className={classNames(globalStyles.root, styles.dark)}>
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
  );
};

export default DevelopmentMode;
