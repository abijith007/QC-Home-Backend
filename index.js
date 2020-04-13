const express = require("express");
const cors = require("cors");
var app = express();
const bodyparser = require("body-parser");

app.use(cors());

app.use(bodyparser.json());

app.listen(4000, () =>
  console.log("Express server is runnig at port no : 4000")
);

app.get("/", (req, res) => {
  res.send("Welcome to the QC@Home server");
});

app.post("/data", (req, res) => {
  console.log(req.body);
});
