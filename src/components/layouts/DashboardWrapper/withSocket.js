import { io, Manager } from "socket.io-client";

function withSocket() {
  const socket = io(process.env.REACT_APP_WEB_SOCKET_URL, {
    reconnectionDelayMax: 10000,
  });

  socket.on("error", (err) => {
    console.log(err);
  });

  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  return socket;
}

export default withSocket;
