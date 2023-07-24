
import React, { useEffect, useState } from "react";
import { socket } from "utils/socket";
import CodeEditor from "components/DevelopmentMode/CodeEditor";

const DevelopmentMode = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected!");
      console.log("Emitting message to server...");
      socket.emit("echo", "fhfgfghfhg");
    }

    const onDisconnect = () => {
      console.log("Disconnected!");
    }

    const onEcho = (data: any) => {
      console.log(`Received message: ${data}`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("echo", onEcho);
    // socket.on("stdOutput", onStdOutput);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("echo", onEcho);
      // socket.off("stdOutput", onStdOutput);
    };
  }, []);

  return (
    <CodeEditor />
  );
};

export default DevelopmentMode;




    // interface Line {
    //   key: number,
    //   content: string,
    //   input: boolean,
    // }

    // const [lines, setLines] = useState<Line[]>([]);

    // let currentLine = "fsdfd"

    // const onStdOutput = (data: any) => {
    //   setLines([...lines, { key: lines.length, content: data, input: false }])
    // }
