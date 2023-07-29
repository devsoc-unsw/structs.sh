import { useEffect, useCallback } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import VisualizerMain from './src/VisualizerMain';

const DevelopmentMode = () => {
  const onGetBreakpoints = useCallback((data: any) => {
    console.log(`Received message!!: ${data}`);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
      socket.emit('echo', 'example');
      //      socket.emit("getBreakpoints", "121", "list2")
      //      socket.emit("getBreakpoints", "122", "list2")
      //      socket.emit("getBreakpoints", "123", "list2")
      //      socket.emit("getBreakpoints", "124", "list2")
      //      socket.emit("getBreakpoints", "125", "list2")
      //      socket.emit("getBreakpoints", "126", "list2")

      socket.emit('sendDummyData', '100');
      socket.emit('sendDummyData', '101');
      socket.emit('sendDummyData', '102');
      socket.emit('sendDummyData', '103');
      socket.emit('sendDummyData', '104');
      socket.emit('sendDummyData', '105');
    };

    const onDisconnect = () => {
      console.log('Disconnected!');
    };

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    };

    const onGetBreakpoints = (data: any) => {
      console.log(`Received message: ${data}`);
    };

    const onSendDummyData = (data: any) => {
      console.log(`Received message: ${data}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('echo', onEcho);
    socket.on('getBreakpoints', onGetBreakpoints);
    socket.on('sendDummyData', onSendDummyData);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('echo', onEcho);
      socket.off('getBreakpoints', onGetBreakpoints);
      socket.off('sendDummyData', onSendDummyData);
    };
  }, [onGetBreakpoints]);

  return (
    <div className={classNames(globalStyles.root, styles.dark)}>
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          Nav bar
        </div>
        <div className={classNames(styles.pane, styles.files)}>
          File tree
        </div>
        <div className={classNames(styles.pane, styles.editor)}>
          Code editor
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
          <VisualizerMain onGetBreakPoint={onGetBreakpoints}/>
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          Timeline
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
