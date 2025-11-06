// import libraries required to connect users to server and manage database
var express = require('express');
var socket = require('socket.io');
 
// send connected users the public folder containing script.js
var app = express();
app.use(express.static('public'));
 
var server = app.listen(3000, () => {
    console.log('server running');
})
 
// log serverside user socket id
function connected(socket) {
    console.log(socket.id + " has connected");
}
 