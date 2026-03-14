const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*"
  }
});

let patientData = {};
let status = "inactive";

io.on("connection", (socket) => {

  console.log("Client connected");

  socket.emit("update", { patientData, status });

  socket.on("patientUpdate", (data) => {
    patientData = data;
    status = "active";

    io.emit("update", { patientData, status });
  });

  socket.on("submit", () => {
    status = "submitted";
    io.emit("update", { patientData, status });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    status = "inactive";
    io.emit("update", { patientData, status });
  });

});

console.log("Socket server running on port 3001");