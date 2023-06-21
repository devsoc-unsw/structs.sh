
import React, { useEffect } from "react";
import { socket } from "utils/socket";
import CodeEditor from "components/DevelopmentMode/CodeEditor";

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");
      console.log("Emitting message to server...");
      socket.emit("echo", "example");
      socket.emit("get_breakpoints", {breakpoints:["1","5","function1","main"]});
    }

    const onDisconnect = () => {
      console.log("Disconnected!");
    }

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    }

    const onBreakpoints = (data: any) => {
      console.log(`Received: ${data}`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("echo", onEcho);
    socket.on("breakpoints", onBreakpoints);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("echo", onEcho);
    };
  }, []);

  return (
    <CodeEditor />
  );
};

export default DevelopmentMode;
