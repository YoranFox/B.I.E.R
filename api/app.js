const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  allowEIO3: true,
});

// parse application/json
app.use(bodyParser.json());

ROBOT_KEY = "superSecretKey";
HANDSHAKE_KEY = "handshake";
AUTH_KEY = "superSecretKey";
SEND_ACTION_KEY = "action";
SEND_SHUTDOWN_KEY = "shutdown_robot";
SEND_ACTIVATE_KEY = "activate_robot";
ACTION_TYPE_ORDER = "order";
ACTION_TYPE_IDLE = "idle";

actions = [];
currentAction = null;

robot_sockets = {};

app.get("/robots", async (req, res) => {
  return res.send(Object.keys(robot_sockets));
});

app.post("/order", async (req, res) => {
  body = req.body;

  const action = {
    type: ACTION_TYPE_ORDER,
    bierId: body.bierId,
    locationX: body.locationX,
    locationY: body.locationY,
  };

  robot_sockets[body.robot_id].emit(SEND_ACTION_KEY, action);

  return res.send("OK");
});

app.post("/shutdown", async (req, res) => {
  body = req.body;

  robot_sockets[body.robot_id].emit(SEND_SHUTDOWN_KEY);

  return res.send("OK");
});

app.post("/activate", async (req, res) => {
  body = req.body;

  robot_sockets[body.robot_id].emit(SEND_ACTIVATE_KEY);

  return res.send("OK");
});

io.on("connection", function (socket) {
  const params = socket.handshake.query;

  console.log(`robot ${params.robot_id} trying to connect`);

  if (params.auth !== AUTH_KEY) {
    console.log("Not authenticated");
    return;
  }

  console.log(`robot ${params.robot_id} authenticated`);

  robot_sockets[params.robot_id] = socket;

  socket.on(HANDSHAKE_KEY, () => {
    console.log("handshake recieved");
    socket.emit(HANDSHAKE_KEY);
  });

  socket.on("disconnect", () => {
    console.log(`robot ${params.robot_id} disconnected`);
    delete robot_sockets[params.robot_id];
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
