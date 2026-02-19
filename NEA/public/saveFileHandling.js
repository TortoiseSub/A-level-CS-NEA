//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Client side save file handling for server communication
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var socket = io.connect()
socket.on(`receiveReadData`, (data) => { receiveReadData(data) })
socket.on(`receiveWriteData`, (data) => { receiveWriteData(data) })

//Send data to server to write to file
function callWriteData(filepath, data){
    let transferData ={
        filepath : filepath,
        data : data
    }
    socket.emit(`callWriteData`, (transferData))
}

//Request data from server to read from file
async function callReadData(filepath){
    return new Promise((resolve,reject) => {
        socket.emit(`callReadData`, (filepath), (transferData) => {
            console.log('read errors : ' + transferData.err)
            if(transferData.err){
                reject(new Error(transferData.err))
            }
            else{
                resolve(transferData.readData)
            }
        })
    })
}

// Receive write data confirmation from server
function receiveWriteData(err){
    console.log('write errors : ' + err)

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Read, write, load and save data
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Write updated control settings to all save files
async function updateControls(){
    let saveData1 = await readSaveData(1)
    saveData1.controls = controls
    saveData(`1`)
    let saveData2 = await readSaveData(2)
    saveData2.controls = controls
    saveData(`2`)
    let saveData3 = await readSaveData(3)
    saveData3.controls = controls
    saveData(`3`)
    let saveData4 = await readSaveData(4)
    saveData4.controls = controls
    saveData(`4`)
    let saveDataBlank = await readSaveData(`blank`)
    saveDataBlank.controls = controls
    saveData(`blank`)
}

// Save data to specified save file
async function saveData(saveFile){
    // Gather data to be saved 
    let data = getSavingData()

    // Encrypt data 
    let writeData = await encryptData(data)

    //Asign file path based on save file selected
    let filepath
    if(saveFile == `blank`){
        filepath = `Savefiles/blankSaveFile.txt`
    }
    else if(saveFile == 1){
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

    // Send data to server to write to file 
    callWriteData(filepath, writeData)
}

async function readSaveData(saveFile){

    //Asign file path based on save file selected
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
    else if(saveFile == `blank`){
        filepath = `Savefiles/saveFileBlank.txt`
    }


    console.log('Reading from : ' + filepath)
    // Request encrypted data from server
    let encryptedData = await callReadData(filepath)
    // Decrypt data
    let data = await decryptData(encryptedData)
    // Convert data to a dictionary
    let saveData = JSON.parse(data)
    return saveData
}

async function loadSaveData(saveFile){ // Load data from specified save file and implement into the game
    let saveData = await readSaveData(saveFile)
    implementSavingData(saveData)
}

function implementSavingData(saveData){ // Assign variables from the loaded data 
    jumpHacked = saveData.jumpHacked
    doubleJumpUnlocked = saveData.doubleJumpUnlocked
    dashUnlocked = saveData.dashUnlocked
    wallJumpSlideUnlocked = saveData.wallJumpSlideUnlocked
    maxHealth = saveData.maxHealth
    controls = saveData.controls
    //cheats = saveData.cheats
    currentSaveLocation = saveData.currentSaveLocation
    fileType = saveData.fileType




}

function getSavingData(){
    // Gather all data to be saved into a dictionary and convert to string
    let saveData = {
        jumpHacked : jumpHacked,
        doubleJumpUnlocked : doubleJumpUnlocked,
        dashUnlocked : dashUnlocked,
        wallJumpSlideUnlocked : wallJumpSlideUnlocked,
        maxHealth : maxHealth,
        controls : controls,
        cheats : cheats,
        currentSaveLocation : currentSaveLocation,
        fileType : fileType,
    }
    saveData = JSON.stringify(saveData)
    return saveData
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Encryption and Decryption functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generate a random 64 bit string
function generateSalt(){
    let salt = ``
    // Count number of 0s and 1s for testing randomness
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

// Generate HMAC for data integrity verification
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

//Cipher and DeCipher functions using XOR masking and SHA-256 hashing for key generation
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

//Encrypt and Decrypt functions with HMAC for data integrity verification
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

//Function for generating a hash based off two parameters
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
