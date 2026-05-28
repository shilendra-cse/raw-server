import net from "node:net";

const PORT = 3000;

try {
  const server = net.createServer((socket) => {
    console.log("client connected");
    socket.setEncoding("utf8");

    let requestBuffer = "";

    socket.on("data", (data) => {
      requestBuffer += data; //reading buffer from incoming data

      const splitIdx = requestBuffer.indexOf("\r\n\r\n"); // \r\n\r\n string denotes end of http request == all packets recieved

      let headerSection = ""; //http headers
      let body = ""; //http body optional

      if (splitIdx != -1) {
        // -> condition checks if split index exist

        //REQUEST PARSING STARTED
        headerSection = requestBuffer.slice(0, splitIdx); //header is extracted as string
        body = requestBuffer.slice(splitIdx + 4); //body is extracted as string

        // -> extracting header lines
        const lines = headerSection.split("\r\n"); //lines end with \r\n string in a http request

        // -> extracting http [req method, req path, http version] from header section
        const [method, path, version] = lines[0].split(" "); //method, path, version is in first line seperated by " "(empty space)

        // -> removing first extracted line -> now remaining is the actual header
        const headerLines = lines.slice(1); //slice the first method line

        const headers = {}; // TO STORE HEADERS JSON

        // -> Extracting headers key,value for each header line -> inserting it into headers json
        headerLines.forEach((line) => {
          const colonIdx = line.indexOf(":"); // key, valye seperated by :
          if (colonIdx != -1) {
            const key = line.slice(0, colonIdx).trim().toLowerCase();
            const value = line.slice(colonIdx + 1).trim();

            headers[key] = value;
          }
        });

        // -> Building the final request object
        const req = { method, path, version, headers };

        console.log(req);
        socket.end();
      }
    });

    socket.on("end", () => {
      console.log(`Client disconnected`);
    });
  });

  server.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
