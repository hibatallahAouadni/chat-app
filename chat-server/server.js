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


var server = http.createServer(app);

var io = require("socket.io")(server);
var users_connected = [];
io.on('connection', function(client) {
    client.on('disconnect', function() {
        console.log("disconnected")
    });
    client.on('room', function(data) {
        client.join(data.roomId);
        console.log(' Client joined the room and client id is '+ client.id);
    });
    client.on('connected', function(user) {
        console.log(user);
        users_connected.push(user);
        client.broadcast.emit('listUsers', users_connected);
        client.emit('listUsers', users_connected);
    });
    client.on('sendMail', function(data) {
        console.log(data);
    });
});

server.listen(PORT);

console.log("Serveur démarré sur le port " + PORT);