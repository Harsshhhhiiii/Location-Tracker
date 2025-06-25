const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Connected");
  console.log(socket.id);
  socket.on("send-location", (data) => {
    console.log("Location received:", data);
    // console.log(socket.id);
    io.emit("recieve-location", {
        id: socket.id,
        ...data
    });
  });
  socket.on("disconnect", (socket) => {
    io.emit("user-disconnected", {
      id: socket.id
    });
    console.log("Disconnected");
    
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:8000");
});

module.exports = { app, server, io };
