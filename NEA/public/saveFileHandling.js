var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

let initialState = `1010000001000011111011111011100010010100100000110100100001001010111011001111100010110011100100011111110011111001101010011000011110010110101101000010110011110000000001001010100001101111010110011110100011101001101100101011001101000101001101110001011101010010`

async function breakTEST(){
    let data = await cipherData(`Test data : TestData123!@#_Example$%^&*(2025)-+=[]{}|;:'",.<>?/`, initialState)
    console.log(data)
}
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
async function cipherData(data,initialState){
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
    for(let i = 0; i < data.length; i++){
        characterCode = data.charCodeAt(i).toString(2)
        if(characterCode.length != 8){
            placeHolderCount = 8 - characterCode.length
            for(j = 0; j < placeHolderCount; j ++){
                characterCode = `0` + characterCode
            }
        }
        plainTextCodes.push(characterCode)
    }
    console.log(plainTextCodes)
    console.log(plainTextCodes.length)
    for(let i = 0; i < plainTextCodes.length;i++){
        console.log(currentState)
        console.log(encryptedTextCodes)
        //2. 
        console.log(i)
        let bounds =[i*8,i*8+8]
        if(bounds[1] > 256){
            bounds[0] -= 256
            bounds[1] -= 256
        }
        console.log(bounds)
        key = currentState.slice(bounds[0], bounds[1])
        console.log(`key : `, key)
        //3. 
        encryptedTextCodes.push(maskXOR(plainTextCodes[i],key))
        //4. 5.
        currentState = await hash256(encryptedTextCodes[i],key)   
    }
    return encryptedTextCodes
}

function encryptData(data, initialState){ 

}

async function hash256(parameter1,parameter2){
    let hashInput = parameter1 + parameter2
    let hashOutput = ``

    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(hashInput);                    
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    //Convert to 256 string
    for(let i = 0; i < hashArray.length; i++){
        hashArray[i] = hashArray[i].toString(2)
        if(hashArray[i].length != 8){
            placeHolderCount = 8 - hashArray[i].length
            for(j = 0; j < placeHolderCount; j ++){
                hashArray[i] = `0` + hashArray[i]
            }
        }
    }
    for(let i = 0; i < hashArray.length;i++){
        hashOutput = hashOutput + hashArray[i]
    }
    return hashOutput
}


function maskXOR(value1, value2){
    let XORValue = []
    if(value1.length == value2.length){
        for(let i = 0; i < value1.length ; i++){
            let iterationValue = -1
            if(value1[i] == value2[i]){
                iterationValue = 0
            }
            else if(value1[i] == value2[i]){
                iterationValue = 1
            }
            XORValue.push(iterationValue)
        }
        XORValue = XORValue.toString()
    }
    else{
        console.log('Values are not the same length')
        console.log(value1, ` : `, value2)
    }
    return XORValue
}
