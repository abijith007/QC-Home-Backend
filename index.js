const express = require("express");
const cors = require("cors");
var app = express();
const bodyparser = require("body-parser");

keys = require("./key");

var fs = require("fs");
const exec = require("child_process").exec;

app.use(cors());

app.use(bodyparser.json());

function execute(command) {
  exec(command, (err, stdout, stderr) => {
    process.stdout.write(stdout);
  });
}

app.listen(4000, () =>
  console.log("Express server is running at port no : 4000")
);

app.get("/", (req, res) => {
  res.send("Welcome to the QC@Home server");
});

app.post("/data", (req, res) => {
  let access = false;

  console.log(req.body);

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === req.body.key) {
      access = true;
    }
  }

  if (access === true) {
    let inputData = "";

    for (let i = 0; i < req.body.cols.length; i++) {
      inputData += "[" + req.body.cols[i].toString() + "]\n";
    }

    let inputText =
      "func test { \n" +
      inputData +
      "}" +
      "\n\nquReg qr = new quReg[" +
      req.body.cols[0].length +
      "]\n" +
      "setPrecision(4)\n" +
      "\n" +
      "qr.test()\n" +
      "qr.Pnz()";

    fs.writeFile("input.qc", inputText, function (err) {
      if (err) throw err;
    });

    execute("./quacc input.qc > out.txt");

    let outputData = {
      probabilities: [],
      time: "",
    };

    setTimeout(() => {
      fs.readFile("out.txt", "utf8", function (err, data) {
        // Display the file content
        temp = data.split("\n");
        var i = 5;
        while (temp[i][0] == "[") {
          var t = "",
            probab = 0.0,
            state = 0;
          for (var j = 1; temp[i][j] != "]"; j++) {
            t = t + temp[i][j];
          }
          state = parseInt(t);
          temp2 = temp[i].split("\t");
          probab = parseFloat(temp2[2]);
          outputData.probabilities.push([state, probab]);
          i++;
        }

        outputData.time = temp[temp.length - 2].split(",")[1];

        res.send(outputData);
      });
    }, 500);
  }
});
