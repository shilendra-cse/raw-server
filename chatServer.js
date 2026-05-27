import net from "node:net";

const PORT = 3000;

const clients = []; // {socket, username}

try {
  const chatServer = net.createServer((socket) => {
    socket.setEncoding("utf8");

    socket.write("Enter your name: ");
    let username = null;

    socket.on("data", (data) => {
      const message = data.trim();
      if (!username) {
        username = message;
        socket.write(
          `${username}, welcome to the chat server! There are ${clients.length} users online.\n`,
        );
        console.log(`Client connected: ${username}\n`);

        clients.push({ socket, username });

        broadcast(`${username} joined the chat.\r\n`, socket);

        //Ask for message
        socket.write("You: ");
        return;
      }

      // ignore empty messages
      if (!message) {
        socket.write("You: ");
        return;
      }

      //normal chat message
      broadcast(`${username}: ${message}\r\n`, socket);
      socket.write("You: ");
    });

    //broadcasting a message to all clients except the sender
    function broadcast(message, sender) {
      clients.forEach((client) => {
        if (client.socket !== sender) {
          client.socket.write(`\r${message}`);
          client.socket.write("You: ");
        }
      });
    }

    socket.on("end", () => {
      console.log(`Client disconnected: ${username}`);
      const index = clients.findIndex((client) => client.socket === socket);

      if (index != -1) {
        clients.splice(index, 1);
      }

      broadcast(`User ${username} left the chat.\r\n`, null);
    });

    // Handle errors
    socket.on("error", (err) => {
      console.error(`Socket error from ${username}:`, err);
    });
  });

  chatServer.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
} catch (error) {
  console.error("Server issues: ", error);
}
