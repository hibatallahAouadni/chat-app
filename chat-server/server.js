var http = require("http");
var fs = require("fs");

var path = require("path");

var mime = require("mime-types");

var express = require("express");

// middlewares
var logger = require("morgan");
var serveStatic = require("serve-static");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");

var PORT = 80;

var app = express();

var root_path = path.join(__dirname, "../");

app.use(logger(":method :url"));
app.use(favicon(root_path + "favicon.ico"));
app.use("/chat-app/", serveStatic(root_path + "/"));


http.createServer(app).listen(PORT);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

console.log("Serveur démarré sur le port " + PORT);