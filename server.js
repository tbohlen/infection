var express = require('express');
var app = express();
const port = 4043;

app.use(express.static("client"))

app.listen(port, () => console.log("Live!"));
