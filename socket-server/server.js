const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

let activePatients = {};
let submittedPatients = [];

io.on("connection", (socket) => {
  console.log("patient connected", socket.id);

  socket.emit("update", {
    activePatients: Object.values(activePatients),
    submittedPatients,
  });

  socket.on("patientUpdate", (data) => {
    console.log("patientUpdate received", data);
    activePatients[socket.id] = {
      id: socket.id,
      ...data,
      status: "typing",
      updatedAt: new Date(),
    };

    io.emit("update", {
      activePatients: Object.values(activePatients),
      submittedPatients,
    });
  });

  socket.on("submit", (data) => {
    const patient = {
      id: Date.now(),
      ...data,
      status: "submitted",
      submittedAt: new Date(),
    };

    submittedPatients.push(patient);

    delete activePatients[socket.id];

    io.emit("update", {
      activePatients: Object.values(activePatients),
      submittedPatients,
    });
  });

  socket.on("disconnect", () => {
    delete activePatients[socket.id];

    io.emit("update", {
      activePatients: Object.values(activePatients),
      submittedPatients,
    });
  });
});
