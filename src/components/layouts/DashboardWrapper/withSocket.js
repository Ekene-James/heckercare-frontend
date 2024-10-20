import { io, Manager } from "socket.io-client";

function withSocket() {
  // const manager = new Manager("ws://d2r4k9hro8158.cloudfront.net/hms", {
  //   reconnectionDelayMax: 10000,
  //   query: {
  //     "my-key": "my-value",
  //   },
  // });
  // const socket = manager.socket("/");

  const socket = io("https://api.heckercare.com/mobile/hms", {
    reconnectionDelayMax: 10000,
    // auth: {
    //   token: "123"
    // },
    // query: {
    //   "my-key": "my-value"
    // }
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
