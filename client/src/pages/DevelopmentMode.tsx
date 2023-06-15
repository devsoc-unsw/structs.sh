
import React, { useEffect } from "react";
import { socket } from "utils/socket";
import CodeEditor from "components/DevelopmentMode/CodeEditor";

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");
      console.log("Emitting message to server...");
      socket.emit("echo", "example");
    }

    const onDisconnect = () => {
      console.log("Disconnected!");
    }

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    }

    const onCompileCode = (data: any) => {
      console.log(`Sent code through websocket: ${data}`);
    }

    const onStdInput = (data: any) => {
      console.log(`Sent standard input through websocket: ${data}`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("echo", onEcho);
    socket.on("compileCode", onCompileCode);
    socket.on("stdInput", onStdInput);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("echo", onEcho);
      socket.off("compileCode", onCompileCode);
      socket.off("stdInput", onStdInput);
    };
  }, []);

  return (
    <CodeEditor />
  );
};

export default DevelopmentMode;
