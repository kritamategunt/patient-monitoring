# Patient Monitoring Realtime Dashboard

A realtime patient monitoring system built with **Next.js** and **WebSocket-based communication**.  
Patients can fill in forms while staff can monitor updates live through a dashboard.

---

# Tech Stack

### Frontend
- Next.js
- React
- TypeScript

### Realtime Communication
- Socket.IO

### Deployment
- Vercel – Frontend hosting
- Railway / Node server – WebSocket server (WIP)

### Package Manager
- pnpm

---

# Project Structure

```
patient-monitoring/
│
├── ui/                    # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── socket-server/         # WebSocket server
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# Features

- Realtime patient monitoring
- Live typing updates
- Patient submission tracking
- Staff dashboard updates instantly
- Staff can edit patient data

---

# Prerequisites

Install the following tools:

- Node.js (v18 or higher)
- pnpm(v9 or higher)

Install pnpm globally if you don't have it:

```bash
npm install -g pnpm
```

---

# Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/kritamategunt/patient-monitoring.git
cd patient-monitoring
```

---

# 2. Start the WebSocket Server

Navigate to the socket server folder:

```bash
cd socket-server
```

Install dependencies:

```bash
pnpm install
```

Run the server:

```bash
node index.js
```

Expected output:

```
Starting socket server...
Server running on port 3001
```

The WebSocket server will run at:

```
http://localhost:3001
```

---

# 3. Start the Next.js Frontend

Open another terminal and go to the UI folder:

```bash
cd ..
```
(run pnpm run dev OR pnpm start on root directory)

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Application will run at:

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env.local` file inside the **ui** folder.

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

This variable tells the frontend where to connect for realtime updates.

---

# Socket Connection Example

Client connection example:

```ts
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

---

# Deployment

## Frontend (Next.js)

Deploy using Vercel:

```bash
vercel
```

Add environment variable in Vercel dashboard:

```
NEXT_PUBLIC_SOCKET_URL=https://socket-server-production-db80.up.railway.app
```

---

## WebSocket Server

Deploy using any Node.js hosting platform:

- Railway (WIP)
- Render
- Fly.io
- VPS / Docker

Ensure the server exposes the correct port:

```
PORT=3001
```

---

# Example Pages

Patient page:

```
/patient
```

Staff dashboard:

```
/staff
```

---

# Realtime Flow

```
Patient opens form
      ↓
Socket connects
      ↓
Patient types data
      ↓
patientUpdate event sent
      ↓
Server broadcasts update
      ↓
Staff dashboard receives update instantly
```

---

# Troubleshooting

### Socket connection refused

Make sure the environment variable is correct:

```
NEXT_PUBLIC_SOCKET_URL
```

Example:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

### CORS error

Allow the frontend domain in the socket server configuration:

```js
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-vercel-domain.vercel.app](https://patient-monitoring-phi.vercel.app/"
    ]
  }
});
```

---

# Future Improvements

- Authentication
- Database integration
- Patient session persistence
- Realtime notifications
- Monitoring dashboard analytics
- seperate web-socket-server into another repo

---

