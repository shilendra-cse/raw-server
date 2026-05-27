import net, { Socket } from "node:net";

const PORT = 3000;

try {
  const server = net.createServer((socket) => {
    console.log("client connected");
  });

  server.listen(PORT, () => {
    console.log("Listening at port: ", PORT);
  });
} catch (error) {
  console.error("Error creating server: ", error);
}
