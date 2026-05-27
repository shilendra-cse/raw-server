import net, { Socket } from "node:net";

const PORT = 3000;

try {
  const server = net.createServer((socket) => {
    console.log("client connected");

    socket.on("data", (buffer) => {
      var message = buffer.toString();
      message = message.toLocaleUpperCase();

      console.log("Client: ", message);
      socket.write(`Server received: ${message}`);
    });

    socket.on("end", () => {
      console.log("client disconnected");
    });
  });

  server.listen(PORT, () => {
    console.log("Listening at port: ", PORT);
  });
} catch (error) {
  console.error("Error creating server: ", error);
}
