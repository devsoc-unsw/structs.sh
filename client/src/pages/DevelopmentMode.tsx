import { useEffect } from 'react';
import { socket } from 'utils/socket';
import CodeEditor from 'components/DevelopmentMode/CodeEditor';

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log('Connected!');
      console.log('Emitting message to server...');
      socket.emit('echo', 'example');
      socket.emit('getBreakpoints', '121', 'list2');
      socket.emit('getBreakpoints', '122', 'list2');
      socket.emit('getBreakpoints', '123', 'list2');
      socket.emit('getBreakpoints', '124', 'list2');
      socket.emit('getBreakpoints', '125', 'list2');
      socket.emit('getBreakpoints', '126', 'list2');
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

  return <CodeEditor />;
};

export default DevelopmentMode;
