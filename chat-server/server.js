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
var messages_sent =[];

emitUsers = function(client, typeEmit, valueEmit) {
    client.broadcast.emit(typeEmit, valueEmit);
    client.emit(typeEmit, valueEmit);
};

searchUser = function(users, user) {
    for(var i = 0; i < users.length; i++) {
        if(users[i].pseudo == user.pseudo) {
            return i;
        }
    }
}

logout = function(client, users, user) {
    var user_index = searchUser(users, user);
    console.log("user_index: " + user_index);
    users.splice(user_index, 1);
    emitUsers(client, 'listUsers', users);
    return users;
};

io.on('connection', function(client) {

    client.on('connected', function(user) {
        console.log(user);
        users_connected.push(user);
        emitUsers(client, 'listUsers', users_connected);
        emitUsers(client, 'listMessages', messages_sent);
    });

    client.on('logout', function(user) {
        console.log("logout");
        users_connected = logout(client, users_connected, user);
    });

    client.on('sendMail', function(msg) {
        console.log(msg);
        messages_sent.push(msg);
        emitUsers(client, 'listMessages', messages_sent);
    });
});

server.listen(PORT);

console.log("Serveur démarré sur le port " + PORT);