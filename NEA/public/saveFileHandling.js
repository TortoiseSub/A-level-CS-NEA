var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

callWriteData(`Savefiles/saveFileBlank.txt`,`Tommy + Scott + 4x tin of mackeral`)

function callWriteData(filepath, data){
    let transferData ={
        filepath : filepath,
        data : data
    }
    socket.emit(`callWriteData`, (transferData))
}

function callReadData(filepath){
    socket.emit(`callReadData`, (filepath))
    console.log('Attempted emit')
}

function receiveReadData(transferData){
    console.log('errors : ' + transferData.err +'\nread data : ', transferData.readData)
    return data
}

function receiveWriteData(err){
    console.log('errors : ' + err)
}