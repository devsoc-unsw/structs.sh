import React, { useCallback, useEffect } from 'react';
import { socket } from 'utils/socket';
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
      socket.emit('getBreakpoints', '126');
    };

    const onDisconnect = () => {
      console.log('Disconnected!');
    };

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("echo", onEcho);
    socket.on("getBreakpoints", onGetBreakpoints)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('echo', onEcho);
      socket.off('getBreakpoints', onGetBreakpoints);
    };
  }, [onGetBreakpoints]);

  return (
    <VisualizerMain onGetBreakPoint={onGetBreakpoints}/>
  );
};

export default DevelopmentMode;
