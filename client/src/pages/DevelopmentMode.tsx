import { useEffect } from 'react';
import { socket } from 'utils/socket';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
      socket.emit('echo', 'example');
    };

    const onDisconnect = () => {
      console.log('Disconnected!');
    };

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('echo', onEcho);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('echo', onEcho);
    };
  }, []);

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
          Visualiser
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          Timeline
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
