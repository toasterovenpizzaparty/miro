const express = require("express");

const port = 3000;

var app = express();
app.use("/", express.static(__dirname + "/examples"));
app.listen(port);

console.log("Running server at http://localhost:" + port + "/");
