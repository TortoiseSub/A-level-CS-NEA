var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

async function breakTEST(){
    data = await encryptData(`CheeseBorgur!, Form SCott yoyur wleckiinmbd blash blahs blah 129482793756775674 I hate harry carter-scott render`)
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
    let salt = ``
    let quantity1 = 0
    let quantity0 = 0
    let value 
    for(let i = 0 ; i < 64;i ++){
        value = Math.random()
        value = Math.round(value)
        if(value == 0){
            quantity0 += 1
        }  
        else if(value == 1){
            quantity1 += 1
        }
        salt += value
    }
    return salt
}
async function generateHMAC(data,key){
    let HMACInput = data + key
    let MAC = ``

    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(HMACInput);                    
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    //Convert to single string of hex numbers
    for(let i = 0; i < hashArray.length;i++){
        MAC = MAC + hashArray[i].toString(16)
    }
    
    return MAC
}


async function cipherData(data,initialState){
    //Test data : TestData123!@#_Example$%^&*(2025)-+=[]{}|;:'",.<>?/`~
    let plainTextCodes = []
    let encryptedTextCodes = []
    let encryptedData = ``
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
    for(let i = 0; i < plainTextCodes.length;i++){
        //2. 
        let bounds =[i*8,i*8+8]
        if(bounds[1] > 256){
            bounds[0] -= 256
            bounds[1] -= 256
        }
        key = currentState.slice(bounds[0], bounds[1])
        //3. 
        console.log(currentState)
        console.log(key)
        console.log(plainTextCodes[i])
        encryptedTextCodes.push(maskXOR(plainTextCodes[i],key))
        //4. 5.
        currentState = await hash256(encryptedTextCodes[i],currentState)   
    }
    for(let i = 0; i < encryptedTextCodes.length ; i++){
        encryptedData += encryptedTextCodes[i]
    }
    return encryptedData
}
async function deCipherData(data,initialState){
    //Test data : TestData123!@#_Example$%^&*(2025)-+=[]{}|;:'",.<>?/`~
    let plainTextCodes = []
    let plainText =``
    let encryptedTextCodes = []
    let currentState = initialState
    let key
    //1. Split data to 8 bit codes for each character
    ////Repeat start
    //2. Generate first key from state
    //3. DEcode bit code using ciphertext bit code XOR key 
    //4. Hash Encrypted bitcode and key
    //5. Save hash as new state
    //6. Generate second key from state second position
    ////7. Repeat for all bits

    //1.
    for(let i = 0; i < data.length/8; i++){
        encryptedTextCodes.push(data.slice(8*i,8*i+8))
    }
    for(let i = 0; i < encryptedTextCodes.length;i++){
        //2. 
        let bounds =[i*8,i*8+8]
        if(bounds[1] > 256){
            bounds[0] -= 256
            bounds[1] -= 256
        }
        key = currentState.slice(bounds[0], bounds[1])
        //3. 
        plainTextCodes.push(maskXOR(encryptedTextCodes[i],key))
        //4. 5.
        currentState = await hash256(encryptedTextCodes[i],currentState)   
    }
    for(let i = 0; i < plainTextCodes.length; i++){
        let characterCode = parseInt(plainTextCodes[i],2)
        let character = String.fromCharCode(characterCode) 
        plainText += character
    }
    return plainText
}

async function encryptData(data){ 
    //Generate Salt and merge with initial State
    let knownKey = `101000000100001111101111101110001001010010000011010010000100101011101100111110001011001110010001111111001111100110101001100001111110100100001000100000101101101110010000111011010111010010111011`
    let salt = generateSalt()
    let initialState = salt+knownKey
    console.log(initialState.length)

    //Cipher Data
    let plainText = data
    let cipheredData = await cipherData(plainText, initialState)

    //Bind salt to data
    let encryptedData = cipheredData + ` ` + salt
    
    //Bind HMAC to data
    let MAC = await generateHMAC(cipheredData, knownKey)
    let sealedData = encryptedData + ` ` + MAC

    return sealedData
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
    let XORValue = ``
    if(value1.length  == value2.length){
        for(let i = 0; i < value1.length ; i++){
            let iterationValue = -1
            if(value1[i] == value2[i]){
                iterationValue = 0
            }
            else if(value1[i] != value2[i]){
                iterationValue = 1
            }
            XORValue += iterationValue.toString()
        }
    }
    else{
        console.log('Values are not the same length')
        console.log(value1, ` : `, value2)
    }
    return XORValue
}
