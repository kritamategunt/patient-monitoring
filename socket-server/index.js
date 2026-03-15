const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Socket server running on", PORT);
});


let activePatients = {};
let submittedPatients = [];
let staffClients = new Set();

function broadcastUpdate() {
  io.emit("update", {
    activePatients: Object.values(activePatients),
    submittedPatients,
  });
}

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("join", (role) => {
    if (role === "staff") {
      console.log("staff connected:", socket.id);

      staffClients.add(socket.id);

      socket.emit("update", {
        activePatients: Object.values(activePatients),
        submittedPatients,
      });
    }

    if (role === "patient") {
      console.log("patient connected:", socket.id);

      activePatients[socket.id] = {
        ...activePatients[socket.id],
        id: socket.id,
        status: "connected",
        startedAt: new Date(),
      };

      broadcastUpdate();
    }
  });

  // patient typing form
  socket.on("patientUpdate", (data) => {
    if (!activePatients[socket.id]) return;

    activePatients[socket.id] = {
      ...activePatients[socket.id],
      ...data,
      status: "typing",
      updatedAt: new Date(),
    };

    broadcastUpdate();
  });

  // staff editing patient
  socket.on("editPatient", (updatedPatient) => {
    console.log("Editing patient:", updatedPatient);
    const index = submittedPatients.findIndex(
      (p) => p.id === updatedPatient.id,
    );

    if (index !== -1) {
      submittedPatients[index] = {
        ...submittedPatients[index],
        ...updatedPatient,
        status: "updating",
        updatedAt: new Date(),
      };

      broadcastUpdate();

      setTimeout(() => {
        submittedPatients[index].status = "submitted";
        broadcastUpdate();
      }, 1000);
    }
  });

  // patient submit form
  socket.on("submit", (data) => {
    console.log("Patient submitted:", data);
    const patient = {
      id: Date.now().toString(),
      ...data,
      status: "submitted",
      submittedAt: new Date(),
    };

    submittedPatients.push(patient);
    console.log("Submitted patients:", submittedPatients);

    delete activePatients[socket.id];

    broadcastUpdate();
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);

    delete activePatients[socket.id];
    staffClients.delete(socket.id);

    broadcastUpdate();
  });
});
