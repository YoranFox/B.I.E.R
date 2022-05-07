const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// parse application/json
app.use(bodyParser.json());

const port = 3000;

actions = [];
currentAction = null;

app.get("/next-action", (req, res) => {
  if (actions.length === 0) {
    return res.send("NO ACTIONS");
  }

  if (currentAction !== null) {
    return res.send("ALREADY DOING ACTION");
  }

  currentAction = actions.shift();

  return res.send(currentAction);
});

app.get("/current-action", (req, res) => {
  return res.send(currentAction);
});

app.post("/complete-action", (req, res) => {
  currentAction = null;
  return res.send("OK");
});

app.post("/order", (req, res) => {
  body = req.body;

  beverageId = body.beverageId;
  locationX = body.locationX;
  locationY = body.lcoationY;

  actions.push(body);

  return res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
