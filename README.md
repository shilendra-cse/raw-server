# raw-server

> **Networking from first principles** — TCP and HTTP servers built with Node.js's raw `net` module. No Express, no frameworks, no magic.

This project peels back the abstraction layers to show what actually happens when a client connects to a server. Each implementation operates at the socket level, handling raw bytes, manually parsing protocols, and managing state by hand.

---

## What's Inside

| File | Description |
|------|-------------|
| `server.js` | Echo TCP server — receives data, transforms it, writes it back |
| `chatServer.js` | Multi-client TCP chat server with usernames and broadcast messaging |
| `httpServer.js` | HTTP/1.1 request parser — reads raw bytes and reconstructs a structured request object |

---

## Servers

### TCP Echo Server (`server.js`)

A minimal TCP server that accepts client connections, reads incoming data from the socket buffer, uppercases the message, and echoes it back. Demonstrates the fundamental request/response loop at the transport layer.

```
Client  ──── "hello" ────►  Server
Client  ◄─── "SERVER RECEIVED: HELLO" ────  Server
```

**Concepts:** Socket lifecycle, `data` / `end` events, writing to a socket buffer.

---

### TCP Chat Server (`chatServer.js`)

A real-time, multi-client chat room over raw TCP. Clients connect with `telnet` or `netcat`, pick a username, and start chatting. Messages are broadcast to every connected client except the sender. Join/leave events are announced to the room.

```
[Alice joins]  →  "Alice joined the chat."  →  [Bob sees it]
[Alice types]  →  "Alice: hey!"             →  [Bob sees it]
[Bob replies]  →  "Bob: hey Alice!"         →  [Alice sees it]
```

**Concepts:** Maintaining a connected-client registry, selective broadcasting, encoding, graceful disconnect cleanup.

---

### HTTP/1.1 Request Parser (`httpServer.js`)

An HTTP server that speaks the actual protocol — no `http` module, just raw TCP sockets. It accumulates incoming chunks into a buffer, detects the `\r\n\r\n` header terminator, then manually tokenizes the request line and headers into a structured object.

```
Raw bytes in:
  GET /api/users HTTP/1.1\r\n
  Host: localhost:3000\r\n
  Accept: application/json\r\n
  \r\n

Parsed out:
  { method: 'GET', path: '/api/users', version: 'HTTP/1.1', headers: { host: '...', accept: '...' } }
```

**Concepts:** TCP stream reassembly, HTTP/1.1 wire format (`\r\n` line endings, header folding, `\r\n\r\n` terminator), header tokenization.

---

## Getting Started

**Prerequisites:** Node.js v18+

```bash
git clone https://github.com/your-username/raw-server.git
cd raw-server
```

No dependencies to install — this project uses only Node.js built-ins.

### Run the Echo Server

```bash
node server.js
```

Connect from another terminal:

```bash
nc localhost 3000
# Type anything and hit Enter
```

### Run the Chat Server

```bash
node chatServer.js
```

Open multiple terminals and connect:

```bash
nc localhost 3000
# Enter a username when prompted, then start chatting
```

### Run the HTTP Parser

```bash
node httpServer.js
```

Send a real HTTP request:

```bash
curl http://localhost:3000/api/test
# or
telnet localhost 3000
```

Watch the terminal — the parsed request object will be logged.

---

## Why Build This?

Most Node.js developers reach for Express (or Fastify, Hono, etc.) on day one. That's the right call for production. But it hides a lot:

- How does a server know when a full HTTP request has arrived? (Answer: it looks for `\r\n\r\n`)
- What does "a connection" actually look like? (Answer: a duplex socket stream)
- How does broadcast messaging work without a message broker? (Answer: iterate over a socket registry)

Building these from scratch forces you to confront those questions and builds intuition that makes you better at debugging, performance tuning, and designing systems — even when you're back to using frameworks.

---

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Networking:** `node:net` — raw TCP sockets
- **Dependencies:** none

---

## Project Structure

```
raw-server/
├── server.js        # TCP echo server
├── chatServer.js    # Multi-client TCP chat
├── httpServer.js    # HTTP/1.1 request parser
└── package.json
```
