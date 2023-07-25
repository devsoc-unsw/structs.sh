import React, { useEffect } from "react";
import { socket } from "utils/socket";
import CodeEditor from "components/DevelopmentMode/CodeEditor";
import EntryPoint from "./src/EnteryPoint";

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");
      console.log("Emitting message to server...");
      socket.emit("echo", "example");
      socket.emit("getBreakpoints", "126")
    }

    const onDisconnect = () => {
      console.log("Disconnected!");
    }

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    }

    const onGetBreakpoints = (data: any) => {
      console.log(`Received message!!: ${data}`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("echo", onEcho);
    socket.on("getBreakpoints", onGetBreakpoints)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("echo", onEcho);
      socket.off("getBreakpoints", onGetBreakpoints)
    };
  }, []);

  return (
    <EntryPoint />
  );
};

export default DevelopmentMode;
