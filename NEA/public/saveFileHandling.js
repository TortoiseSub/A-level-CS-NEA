var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })


async function breakTEST(){
    let data = await decryptData(`00100111111001000110011001000010001111011111010100100111011001100100110010110001001101000010101110010101011110001011101011111101110110100111001001110010001001110111101000010100011001101101010101101001000101000100000001001011111001101001111100111010100110111010000011010001101011100001111000110011011011111111000100101100000000110011100100001011000011101101110110011101010011000111101111010000010100010101000010110101000010001011011010100001110110111111101101011101011101101011001110011011000101010010100100100010111000001100110101001101101011001000101101000001010110000111011101010110101001111111101001001110111101110011001100011111001010000001010100100100100000000000010110001110100011000000011111011100001000001010001100010100000110000000000101011011101011100010000000111100101000101110101001011011001010100001100100001100111001100001111010110101101111100011011001110001111000001001100001000010000000111111011111000010100111111000011011010110011000100101010100000110101101011100111000001110000000011100010110100110011111010100101101111111111110110011010011101110011101111100011101011100100101110110110101010100001010111101011111110011101100110110100000111111111110101100000100011110000100010010001000011110101001010111011000111110100000001111010011001110101100100101011000000011010111011011110110000101011011001010100011011101101100111000101011111101100110100010001011010000000011010000011000001000011100011100001000111100110101010100011011101010010110101110110000111100100010101011000000111010110000011001111011000011100010011110101010000010101111000110101010110001110100111000111010111011111100111010111110101000101001101001100110100100101110001001011010010111011010011011010110110100100001000101000001100110001110101001000011010100101101011001101110000101000011100001010110101110010100001011110111010111101101100111110111000101100000010010100111101101000010110100001101101000100000001110000011011001011111010010111110011010010111101000000000011000100101001101000110010100101011010110111011000000110001011110000110011001101000100111100100100110000011010110111111101110 0101110010011100010111010001111010000010000100001111011011001111 bfcfedb58575063c3af2d904ee57b6616f61bd8b3233c0b7d410a1eb4b`)
    console.log('Decrypted Data : ', data)
}


function callWriteData(filepath, data){
    let transferData ={
        filepath : filepath,
        data : data
    }
    socket.emit(`callWriteData`, (transferData))
}

async function callReadData(filepath){
    return new Promise((resolve,reject) => {
        socket.emit(`callReadData`, (filepath), (transferData) => {
            console.log('errors : ' + transferData.err +'\nread data : ', transferData.readData)
            if(transferData.err){
                reject(new Error(transferData.err))
            }
            else{
                resolve(transferData.readData)
            }
        })
    })
}

function receiveWriteData(err){
    console.log('errors : ' + err)

}

//Encryption
async function updateContols(){
    let saveData1 = await readSaveData(1)
    saveData1.controls = controls
    saveData(saveData1)
    let saveData2 = await readSaveData(2)
    saveData2.controls = controls
    saveData(saveData2)
    let saveData3 = await readSaveData(3)
    saveData3.controls = controls
    saveData(saveData3)
    let saveData4 = await readSaveData(4)
    saveData4.controls = controls
    saveData(saveData4)
}

async function saveData(saveFile){
    let data = getSavingData()
    let writeData = await encryptData(data)
    let filepath

    if(saveFile == 1){
        filepath = `Savefiles/saveFileOne.txt`
    }
    else if(saveFile == 2){
        filepath = `Savefiles/saveFileTwo.txt`
    }
    else if(saveFile == 3){
        filepath = `Savefiles/saveFileThree.txt`
    }
    else if(saveFile == 4){
        filepath = `Savefiles/saveFileFour.txt`
    }
    callWriteData(filepath, writeData)
}
async function readSaveData(saveFile){
    let filepath
    if(saveFile == 1){
        filepath = `Savefiles/saveFileOne.txt`
    }
    else if(saveFile == 2){
        filepath = `Savefiles/saveFileTwo.txt`
    }
    else if(saveFile == 3){
        filepath = `Savefiles/saveFileThree.txt`
    }
    else if(saveFile == 4){
        filepath = `Savefiles/saveFileFour.txt`
    }


    let encryptedData = await callReadData(filepath)
    let data = decryptData(encryptedData)
    saveData = JSON.parse(data)
    return saveData
}

async function readSaveFile(saveFile){
    saveFile
}

function implementSavingData(saveData){
    jumpHacked = saveData.jumpHacked
    doubleJumpUnlocked = saveData.doubleJumpUnlocked
    dashUnlocked = saveData.dashUnlocked
    wallJumpSlideUnlocked = saveData.wallJumpSlideUnlocked
    maxHealth = saveData.maxHealth
    controls = saveData.controls
    //cheats = saveData.cheats
    //currentSaveLocation = saveData.currentSaveLocation
    //steelSoul = saveData.steelSoul




}

function getSavingData(){
    let saveData = {
        jumpHacked : jumpHacked,
        doubleJumpUnlocked : doubleJumpUnlocked,
        dashUnlocked : dashUnlocked,
        wallJumpSlideUnlocked : wallJumpSlideUnlocked,
        maxHealth : maxHealth,
        controls : controls,
        //cheats : cheats,
        //currentSaveLocation : currentSaveLocation,
        //steelSoul : steelSoul,
    }
    saveData = JSON.stringify(saveData)
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
            bounds[0] = ((bounds[0]) % 256)
            bounds[1] = ((bounds[1]) % 256)
            if(bounds[1] == 0){
                bounds[1] = 256
            }
        }
        key = currentState.slice(bounds[0], bounds[1])
        //3. 
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
            bounds[0] = ((bounds[0]) % 256)
            bounds[1] = ((bounds[1]) % 256)
            if(bounds[1] == 0){
                bounds[1] = 256
            }
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
async function decryptData(data){
    let knownKey = `101000000100001111101111101110001001010010000011010010000100101011101100111110001011001110010001111111001111100110101001100001111110100100001000100000101101101110010000111011010111010010111011`

    let dataPoints = data.split(` `)
    let listedMAC = dataPoints[2]
    let encryptedData = dataPoints[0] + ` ` + dataPoints[1]
    let MAC = await generateHMAC(encryptedData, knownKey)
    if(listedMAC == MAC){
        console.log(`Data verified`)
        let initialState = dataPoints[1] + knownKey
        let plainText = deCipherData(dataPoints[0],initialState)
        return plainText
    }
    else{
        console.log(`Corruption/tampering detected`)
        return null
    }
}

async function encryptData(data){ 
    //Generate Salt and merge with initial State
    let knownKey = `101000000100001111101111101110001001010010000011010010000100101011101100111110001011001110010001111111001111100110101001100001111110100100001000100000101101101110010000111011010111010010111011`
    let salt = generateSalt()
    let initialState = salt+knownKey

    //Cipher Data
    let plainText = data
    let cipheredData = await cipherData(plainText, initialState)

    //Bind salt to data
    let encryptedData = cipheredData + ` ` + salt
    
    //Bind HMAC to data
    let MAC = await generateHMAC(encryptedData, knownKey)
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
