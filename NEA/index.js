// import libraries required to connect users to server and manage database
var express = require('express');
var socket = require('socket.io');
var fs = require(`fs`);
const { isKeyObject } = require('util/types');
// const { isKeyObject } = require('util/types');
 
// send connected users the public folder containing script.js
var app = express();
app.use(express.static('public'));
 
var server = app.listen(3000, () => {
    console.log('server running');
})
 
// log serverside user socket id
function connected(socket) {
    console.log(socket.id + " has connected");

    socket.on(`callWriteData`, (filepath, data) => {writeData(filepath,data)})
    socket.on(`callReadData`, (filepath) => {readData(filepath)})
}

//File Handling



function writeData(filepath,data){
    try {
        const jsonData = JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
        })
        fs.writeFile(filepath, jsonData, 'utf8')
        console.log('User data saved successfully!')
    } 
    catch (error) {
        console.error('Failed to save user data:', error.message)
        throw error
    }
    io.emit(`receiveWriteData` (data))
}

function readData(filepath){
    try {
        const data = fs.readFile(filepath, 'utf8')
        const config = JSON.parse(data)
        console.log('Configuration loaded:', config)
    } 
    catch (error) {
        console.error('Failed to read config file:', error.message)
    }
    io.emit(`receiveReadData`, (data))
}