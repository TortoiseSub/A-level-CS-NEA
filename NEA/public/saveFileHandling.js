var socket = io.connect
io.on(`recieveReadData`, (data) => { receiveReadData(data) })
io.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

let readFileData
let writtenFileData


callReadData(`Savefiles/saveFileBlank.txt`)
console.log(readFileData)

function callWriteData(filepath, data){
    socket.emit(`callWriteData`, (filepath,data))
}

function callReadData(filepath){
    socket.emit(`callReadData`, (filepath))
}

function receiveReadData(data){
    readFileData = data
}

function receiveWriteData(data){
    writtenFileData = data
}