const express = require("express");
var cors = require("cors");
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
app.use(cors());

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
  const robots = Object.keys(robot_sockets);
  return res.send(
    robots.map((key) => {
      const robot = robot_sockets[key];
      return {
        id: key,
        status: robot.status,
      };
    })
  );
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
  res.body = {};
  res.status(200).json({ status: "ok" });
});

app.post("/robots/shutdown", async (req, res) => {
  body = req.body;

  console.log(`Shutting down robot with id ${body.robot_id}`);
  robot_sockets[body.robot_id].socket.emit(SEND_SHUTDOWN_KEY);
  robot_sockets[body.robot_id].status = "INACTIVE";
  res.status(200).json({ status: "ok" });
});

app.post("/robots/activate", async (req, res) => {
  body = req.body;
  console.log(`Activating robot with id ${body.robot_id}`);
  robot_sockets[body.robot_id].socket.emit(SEND_ACTIVATE_KEY);
  robot_sockets[body.robot_id].status = "ACTIVE";

  res.status(200).json({ status: "ok" });
});

io.on("connection", function (socket) {
  const params = socket.handshake.query;

  console.log(`robot ${params.robot_id} trying to connect`);

  if (params.auth !== AUTH_KEY) {
    console.log("Not authenticated");
    return;
  }

  console.log(`robot ${params.robot_id} authenticated`);

  robot_sockets[params.robot_id] = { socket, status: "INACTIVE" };

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
