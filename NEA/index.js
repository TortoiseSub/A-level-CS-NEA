//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Server Management
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import libraries required to connect users to server and manage database
var express = require('express');
var socket = require('socket.io');
var fs = require(`fs`);


 
// send connected users the public folder containing script.js
var app = express();
app.use(express.static('public'));
 
var server = app.listen(3000, () => {
    console.log('server running');
})

//setup IO connection with user 
var io = socket(server)
io.on(`connection`, connected)
 
// log serverside user socket id
function connected(socket) {
    console.log(socket.id + " has connected");

    socket.on(`callWriteData`, (transferData) => {writeData(transferData)})

    socket.on(`callReadData`, (filepath,callback) => {
        console.log(`reading data`)
        fs.readFile(filepath, 'utf8',(err, data) => {

            console.log('errors : ' , err,'\nread data : ', data)
            let transferData = {
                err : err,
                readData: data
            }
            callback(transferData)

        })

    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Save file management 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//File Handling
function writeData(transferData){
    fs.writeFile(transferData.filepath, transferData.data, 'utf8', (err) => {

        console.log('errors : ' , err)
        io.emit('receiveWriteData', (err))

    })
    console.log('User data saved successfully!')
}

function readData(filepath){
    console.log(`reading data`)
    fs.readFile(filepath, 'utf8',(err, data) => {

        console.log('errors : ' , err,'\nread data : ', data)
        let transferData = {
            err : err,
            readData: data
        }
        io.emit(`receiveReadData`, (transferData))

    })
}