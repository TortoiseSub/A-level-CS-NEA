var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

let readFileData
let writtenFileData


readFileData = callReadData(`Savefiles/saveFileBlank.txt`)
console.log('data : ' + readFileData)

function callWriteData(filepath, data){
    socket.emit(`callWriteData`, (filepath,data))
}

function callReadData(filepath){
    socket.emit(`callReadData`, (filepath))
    console.log('Attempted emit')
}

function receiveReadData(data){
    console.log('read data : ', data)
    return data
}

function receiveWriteData(data){
    writtenFileData = data
}