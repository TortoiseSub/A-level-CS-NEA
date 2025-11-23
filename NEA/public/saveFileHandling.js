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

//Encryption

let initialState = 

function getSavingData(){
    saveData = {
        jumpHacked : jumphacked,
        doubleJumpedUnlocked : doubleJumpedUnlocked,
        dashUnlocked : dashUnlocked,
        wallJumpSlideUnlocked : wallJumpSlideUnlocked,
    }
    return saveData
}
function generateSalt(){

}
function generateHMAC(data,initialState){

}
function cipherData(data,initialState){
    //Test data : TestData123!@#_Example$%^&*(2025)-+=[]{}|;:'",.<>?/`~
    let plainTextCodes = []
    let encryptedTextCodes = []
    let currentState = initialState
    let key
    //1. Convert data to bit codes for each character
    ////Repeat start
    //2. Generate first key from state
    //3. Encode bit code using plaintext bit code XOR key 
    //4. Hash Encrypted bitcode and key
    //5. Save hash as new state
    //6. Generate second key from state second position
    ////7. Repeat for all bits

    //1.
    for(i = 0; i < data.length; i++){
        plainTextCodes = [].push(data.charCodeAt(i))
    }

    for(i = 0; i < plainTextCodes.length; i++){
        //2. 
        key = currentState.slice(i*8, i*8 +8)
        //3. 
        encryptedTextCodes.push(maskXOR(plainTextCodes[i],key))
        //4. 5.
        currentState = hash(encryptedTextCodes[i],key)
        
    }
    
}

function encryptData(data, initialState){

}

function maskXOR(value1, value2){
    let XORValue = []
    if(value1.length == value2.length){
        for(i = 0; i < value1.length ; i++){
            let iterationValue = -1
            if(value1[i] == value2[i]){
                iterationValue = 0
            }
            if(value1[i] == value2[i]){
                iterationValue = 1
            }
            XORValue.push(iterationValue)
        }
        XORValue = XORValue.toString()
    }
    else{
        console.log('Values are not the same length')
    }
    return XORValue
}
