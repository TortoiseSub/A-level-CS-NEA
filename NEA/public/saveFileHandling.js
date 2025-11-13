var socket = io.connect()
io.on(`recieveReadData`, (data) => { receiveReadData(data) })
io.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

let readFileData
let writtenFileData


callReadData(`Savefiles/saveFileBlank.txt`)
console.log('data : ' + readFileData)

function callWriteData(filepath, data){
    socket.emit(`callWriteData`, (filepath,data))
}

function callReadData(filepath){
    socket.emit(`callReadData`, (filepath))
    console.log('Attempted emit')
}

function receiveReadData(data){
    readFileData = data
    console.log('recieved read data')
}

function receiveWriteData(data){
    writtenFileData = data
}