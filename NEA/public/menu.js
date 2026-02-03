//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Variable Setup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////main menu images
let playButtonImage = null
let playButtonSelectedImage = null
let controlsButtonImage = null
let controlsButtonSelectedImage = null

//// Save file menu images (instantiated here so preload can assign)
//Save file 1
let saveFile1SelectedImage = null
let saveFile1SteelSoulBrokenSelectedImage = null
let saveFile1SteelSoulBrokenImage = null
let saveFile1SteelSoulSelectedImage = null
let saveFile1SteelSoulImage = null
let saveFile1Image = null

//save file 2
let saveFile2SelectedImage = null
let saveFile2SteelSoulBrokenSelectedImage = null
let saveFile2SteelSoulBrokenImage = null
let saveFile2SteelSoulSelectedImage = null
let saveFile2SteelSoulImage = null
let saveFile2Image = null

//Save file 3
let saveFile3SelectedImage = null
let saveFile3SteelSoulBrokenSelectedImage = null
let saveFile3SteelSoulBrokenImage = null
let saveFile3SteelSoulSelectedImage = null
let saveFile3SteelSoulImage = null
let saveFile3Image = null

//Save file 4
let saveFile4SelectedImage = null
let saveFile4SteelSoulBrokenSelectedImage = null
let saveFile4SteelSoulBrokenImage = null
let saveFile4SteelSoulSelectedImage = null
let saveFile4SteelSoulImage = null
let saveFile4Image = null

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Menu Input Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function menuInputs(navigationParameters){
    //navigationParameters = [menuName, currentSelectedButton, buttonRange[min,max], buttonsGroup]
    //Navigation parameters holds all the menu navigation data

    for(i = 0 ; i <= navigationParameters[2][1] ; i++){
        //NavigationParameters[2][1] is the max index of buttons in the menu

        //navigationParameters[3][i] is the button at index i in the buttons group
        if (navigationParameters[3][i].defaultImage != null) {
            navigationParameters[3][i].image = navigationParameters[3][i].defaultImage
            navigationParameters[3][i].image.scale = 0.625
        }

        //navigationParameters[1] is the current selected button index
        if(i == navigationParameters[1]){
            if(navigationParameters[3][i].selectedImage != null){
                navigationParameters[3][i].image = navigationParameters[3][i].selectedImage
                navigationParameters[3][i].image.scale = 0.625
            }
        }
    }
    //increase the selected button index
    if(kb.presses(`down`)){
        navigationParameters[1] += 1
        //Loop if above max range
        if(navigationParameters[1] > navigationParameters[2][1]){
            navigationParameters[1] = navigationParameters[2][0]
        }

        for(i = 0 ; i <= navigationParameters[2][1] ; i++){
            //Iterate through all buttons to reset their colours and images
            navigationParameters[3][i].color = navigationParameters[3][i].defaultColor
            if (navigationParameters[3][i].defaultImage != null) { //Validate that a default image exists before setting
                navigationParameters[3][i].image = navigationParameters[3][i].defaultImage
                navigationParameters[3][i].image.scale = 0.625
            }
            //Iterate through all buttons and set the selected button to their selected colour and image
            if(i == navigationParameters[1]){
                navigationParameters[3][i].color = navigationParameters[3][i].selectedColour
                if(navigationParameters[3][i].selectedImage != null){ // Validate that a selected image exists before setting
                    navigationParameters[3][i].image = navigationParameters[3][i].selectedImage
                    navigationParameters[3][i].image.scale = 0.625
                }
            }
        }
    }
    //Decrease the selected button index
    else if(kb.presses(`up`)){
        navigationParameters[1] -= 1
        //Loop if below min range
        if(navigationParameters[1] < navigationParameters[2][0]){
            navigationParameters[1] = navigationParameters[2][1]
        }


        for(i = 0 ; i <= navigationParameters[2][1] ; i++){
            //Iterate through all buttons to reset their colours and images
            navigationParameters[3][i].color = navigationParameters[3][i].defaultColor
            if(navigationParameters[3][i].defaultImage != null  ) { //Validate that a default image exists before setting
                navigationParameters[3][i].image = navigationParameters[3][i].defaultImage
                navigationParameters[3][i].image.scale = 0.625
            }
            //Iterate through all buttons and set the selected button to their selected colour and image
            if(i == navigationParameters[1]){ 
                navigationParameters[3][i].color = navigationParameters[3][i].selectedColour
                if(navigationParameters[3][i].selectedImage != null){ // Validate that a selected image exists before setting
                    navigationParameters[3][i].image = navigationParameters[3][i].selectedImage
                    navigationParameters[3][i].image.scale = 0.625
                }
            }
        }
    }
    if(kb.pressed(`ENTER`)){ // Activate selected button 
        activateButton(navigationParameters[1],navigationParameters[0])
    }

    // Mouse input for menu buttons
    if(mouse.presses()){
        for(let i = 0 ; i <= navigationParameters[2][1] ; i ++){ //Iterate through all buttons to check if the mouse is overlapping any 
            if(navigationParameters[3][i].mouse.hovering()){ // P5.js mouse overlap check
                // Iterate through all buttons to reset their colours and images
                for(let j = 0 ; j <= navigationParameters[2][1] ; j++){
                    navigationParameters[3][j].color = navigationParameters[3][j].defaultColor
                    if(navigationParameters[3][j].defaultImage != null){ //Validate that a default image exists before setting
                        navigationParameters[3][j].image = navigationParameters[3][j].defaultImage
                        navigationParameters[3][j].image.scale = 0.625
                    }
                }
                // Set the overlapped button to its selected colour and image
                navigationParameters[3][i].color = navigationParameters[3][i].selectedColour
                if(navigationParameters[3][i].selectedImage != null){ // Validate that a selected image exists before setting
                    navigationParameters[3][i].image = navigationParameters[3][i].selectedImage
                    navigationParameters[3][i].image.scale = 0.625
                }

                // Activate the overlapped button
                navigationParameters[1] = i
                activateButton(navigationParameters[1],navigationParameters[0])
                i = navigationParameters[2][1] + 1 // Exit loop
                }
        }
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Menu Button Activation Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function activateButton(index,menu){
    //Main menu buttons (0 = play, 1 = controls)
    if(menu == `main`){
        if(index == 0){
            openSaveFileMenu()
        }
        else if(index == 1){
            openControlsMenu()
        }
    }
    //Save file buttons (0-3 = load, 4-7 = delete)
    else if(menu == `saveFile`){
        //Check if file is between 0 and 3 inclusive 
        if(index >=0 && index <=3){
            openSaveFile(index)
        }
        //Cjeck if file is between 4 and 7 inclusive
        else if(index >=4 && index <=7){
            //Offer user a comfirmation prompt before deleting the save file
            let comfirmation = window.confirm("Are you sure you want to delete this save file?")
            if(comfirmation){
                //Retrieve blank save file data and overwrite the selected save file with it 
                let writeFilepath = ``
                let blankdata = await callReadData(`Savefiles/saveFileBlank.txt`)

                //Find the file path to overwrite based on the button index
                if(index == 4){ // Delete save file 1
                    writeFilepath = `Savefiles/saveFileOne.txt`
                }
                else if(index == 5){ // Delete save file 2
                    writeFilepath = `Savefiles/saveFileTwo.txt`
                }
                else if(index == 6){ // Delete save file 3
                    writeFilepath = `Savefiles/saveFileThree.txt`
                }
                else if(index == 7){ // Delete save file 4
                    writeFilepath = `Savefiles/saveFileFour.txt`
                }   
                //Overwrite the selected save file with blank data
                callWriteData(writeFilepath, blankdata)

                // Refresh the save file menu images after deletion
                //load save file data and reassign images off of the save files type tag 
                let save1Data
                let save2Data
                let save3Data
                let save4Data
                save1Data = await readSaveData(1)
                save2Data = await readSaveData(2)
                save3Data = await readSaveData(3)
                save4Data = await readSaveData(4)
                console.log(`Save 1 file type: ` + save1Data.fileType)
                console.log(`Save 2 file type: ` + save2Data.fileType)  
                console.log(`Save 3 file type: ` + save3Data.fileType)
                console.log(`Save 4 file type: ` + save4Data.fileType)
                // Slot 1
                if(save1Data.fileType == `normal`){
                    saveFileButton1.defaultImage = saveFile1Image
                    saveFileButton1.selectedImage = saveFile1SelectedImage
                }
                else if(save1Data.fileType == `steelsoul`){
                    saveFileButton1.defaultImage = saveFile1SteelSoulImage
                    saveFileButton1.selectedImage = saveFile1SteelSoulSelectedImage
                }
                else if(save1Data.fileType == `steelsoulbroken`){
                    saveFileButton1.defaultImage = saveFile1SteelSoulBrokenImage
                    saveFileButton1.selectedImage = saveFile1SteelSoulBrokenSelectedImage
                }
                else if(save1Data.fileType == `empty`){
                    saveFileButton1.defaultImage = saveFileBlankImage
                    saveFileButton1.selectedImage = saveFileBlankSelectedImage

                }
                else {
                    console.log(`Unknown file type for save slot 1: ` + save1Data.fileType)
                }
                // Slot 2
                if(save2Data.fileType == `normal`){
                    saveFileButton2.defaultImage = saveFile2Image
                    saveFileButton2.selectedImage = saveFile2SelectedImage
                }
                else if(save2Data.fileType == `steelsoul`){
                    saveFileButton2.defaultImage = saveFile2SteelSoulImage
                    saveFileButton2.selectedImage = saveFile2SteelSoulSelectedImage
                }
                else if(save2Data.fileType == `steelsoulbroken`){
                    saveFileButton2.defaultImage = saveFile2SteelSoulBrokenImage
                    saveFileButton2.selectedImage = saveFile2SteelSoulBrokenSelectedImage
                }
                else if(save2Data.fileType == `empty`){
                    saveFileButton2.defaultImage = saveFileBlankImage
                    saveFileButton2.selectedImage = saveFileBlankSelectedImage
                }
                else{
                    console.log(`Unknown file type for save slot 2: ` + save2Data.fileType)
                    saveFileButton2.defaultImage = null
                    saveFileButton2.selectedImage = null
                }
                // Slot 3
                if(save3Data.fileType == `normal`){
                    saveFileButton3.defaultImage = saveFile3Image
                    saveFileButton3.selectedImage = saveFile3SelectedImage
                }
                else if(save3Data.fileType == `steelsoul`){
                    saveFileButton3.defaultImage = saveFile3SteelSoulImage
                    saveFileButton3.selectedImage = saveFile3SteelSoulSelectedImage
                }
                else if(save3Data.fileType == `steelsoulbroken`){
                    saveFileButton3.defaultImage = saveFile3SteelSoulBrokenImage
                    saveFileButton3.selectedImage = saveFile3SteelSoulBrokenSelectedImage
                }
                else if(save3Data.fileType == `empty`){
                    saveFileButton3.defaultImage = saveFileBlankImage
                    saveFileButton3.selectedImage = saveFileBlankSelectedImage
                }
                else{
                    console.log(`Unknown file type for save slot 3: ` + save3Data.fileType)
                    saveFileButton3.defaultImage = null
                    saveFileButton3.selectedImage = null
                }   

                // Slot 4
                if(save4Data.fileType == `normal`){ 
                    saveFileButton4.defaultImage = saveFile4Image
                    saveFileButton4.selectedImage = saveFile4SelectedImage
                }
                else if(save4Data.fileType == `steelsoul`){
                    saveFileButton4.defaultImage = saveFile4SteelSoulImage
                    saveFileButton4.selectedImage = saveFile4SteelSoulSelectedImage
                }
                else if(save4Data.fileType == `steelsoulbroken`){
                    saveFileButton4.defaultImage = saveFile4SteelSoulBrokenImage
                    saveFileButton4.selectedImage = saveFile4SteelSoulBrokenSelectedImage
                }
                else if(save4Data.fileType == `empty`){
                    saveFileButton4.defaultImage = saveFileBlankImage
                    saveFileButton4.selectedImage = saveFileBlankSelectedImage
                }
                else{
                    console.log(`Unknown file type for save slot 4: ` + save4Data.fileType)
                    saveFileButton4.defaultImage = null
                    saveFileButton4.selectedImage = null
                }
            }
        }
    }
    //Pause menu buttons (0 = resume, 1 = controls, 2 = exit to main menu)
    else if(menu == `pause`){
        if(index == 0){ //Resume game
            unpause()
        }
        else if(index == 1){ //Open controls menu
            openControlsMenu()
        }
        else if(index == 2){ //Exit to main menu
            clearInterval(autoSave)
            saveData(saveFile)
            allSprites.remove()
            openMainMenu()
        }
    }
    //Death menu buttons (0 = respawn, 1 = exit to main menu)
    else if(menu == `death`){
        if(index == 0){ //Resume game
            //Respawn at last save point
            respawnPlayer()
        }
        else if(index == 1){ //Quit to main menu
            //Send to main menu
            clearInterval(autoSave)
            saveData(saveFile)
            allSprites.remove()
            openMainMenu()

        }
    }
    //Controls menu buttons (0 - n-2 = controls, n-1 = save, n = close menu)
    else if(menu == `controls`){
        // index refers to controlsMenuButtons index (controls list + extra buttons)
        if(index < controls.length){
            // Start rebind process for the selected control (assign primary key slot 0)
            startRebind(index)
        }
        else{
            // Extra buttons (save / close menu)
            let action = controlsMenuButtons[index].action
            if(action == `save`){
                // Commit temporary bindings to the live controls
                if(tempControls){
                    controls = JSON.parse(JSON.stringify(tempControls))
                    // Update UI buttons to reflect new saved bindings
                    for(let i = 0; i < controls.length; i++){
                        if(controlsMenuButtons[i]){
                            controlsMenuButtons[i].key1 = controls[i][1][0]
                            controlsMenuButtons[i].key2 = controls[i][1][1]
                        }
                    }
                    // Save the new control scheme to all save files
                    updateControls()
                }
            }
            else if(action == `close menu`){
                // Discard temporary bindings and close the controls menu
                cancelRebind()
                // restore UI labels from live controls
                for(let i = 0; i < controls.length; i++){
                    if(controlsMenuButtons[i]){
                        controlsMenuButtons[i].key1 = controls[i][1][0]
                        controlsMenuButtons[i].key2 = controls[i][1][1]
                    }
                }
                closeControlsMenu()
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Controls Rebinding Functions                          
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Rebinding state and helpers
let tempControls = null // temporary copy of controls while rebinding
let rebindTarget = null // index into controls array currently being rebound
let rebindKeySlot = 0 // which key slot (0 or 1) to write to; default to primary
let rebindListener = null

function startRebind(controlIndex){
    // Initialize tempControls when starting rebinding if needed
    if(!tempControls){
        tempControls = controls
    }

    // If a rebind is already active, cancel it first
    cancelRebind()

    rebindTarget = controlIndex
    rebindKeySlot = 0 // choose primary binding by default

    // Update button label to indicate waiting for key
    if(controlsMenuButtons[controlIndex]){
        controlsMenuButtons[controlIndex].key1 = `press a key...`
    }

    // Listen for the next physical keydown to assign temporarily
    rebindListener = function(e){
        // Use e.key to keep descriptive names like 'ArrowLeft' or 'a'
        let keyName = e.key

        // Space for display
        if(keyName === ' '){
            keyName = 'Space'
        }

        // Prevent binding of Enter/Escape used for UI control (optional)
        if(keyName === 'Enter' || keyName === 'Escape'){
            // treat as cancel
            cancelRebind()
        }

        // Unbind any other control that was already using this key in tempControls
        for(let i = 0; i < tempControls.length; i++){
            if(tempControls[i][1][0] === keyName) tempControls[i][1][0] = ``
            if(tempControls[i][1][1] === keyName) tempControls[i][1][1] = ``
        }

        // Assign into tempControls for the target control
        tempControls[rebindTarget][1][rebindKeySlot] = keyName

        // Update the UI button to reflect the tentative assignment
        if(controlsMenuButtons[rebindTarget]){
            controlsMenuButtons[rebindTarget].key1 = tempControls[rebindTarget][1][0]
            controlsMenuButtons[rebindTarget].key2 = tempControls[rebindTarget][1][1]
        }

        // Finish rebind
        cancelRebind()
    }

    window.addEventListener('keydown', rebindListener)
}

function cancelRebind(){
    if(rebindListener){
        window.removeEventListener('keydown', rebindListener)
        rebindListener = null
    }
    rebindTarget = null
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Menu Setup Functions + menu variables
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Main Menu
let mainMenu
let mainMenuButtons

let mainMenuNavigationParameters = []

let mainMenuBackground
let mainButton1
let mainButton2

let mainSelectedButton
let mainSelectedButtonRange = [0,1]

function mainMenuSetup(){ // Initialize main menu and main menu buttons 
    // Validate windowWidth and windowHeight before using them
    let w = windowWidth || window.innerWidth || 1024
    let h = windowHeight || window.innerHeight || 768
    w = Math.max(1, Math.min(Number.isFinite(w) ? parseInt(w) : 1024, 4096))
    h = Math.max(1, Math.min(Number.isFinite(h) ? parseInt(h) : 768, 4096))


    mainMenu = new Group()
    mainMenuButtons = new mainMenu.Group()

 	mainMenuBackground = new mainMenu.Sprite(w/2,h/2,w,h,`rectangle`)
	mainMenuBackground.color = `#444444`

    //Save file menu button
	mainButton1 = new mainMenuButtons.Sprite(w/2,h/2 - 100,500,100,`rectangle`)		
    mainButton1.color = `#5b5b5b`
	mainButton1.defaultColor = `#5b5b5b`
	mainButton1.selectedColour = `#999999`
	mainButton1.defaultImage = playButtonImage
	mainButton1.selectedImage = playButtonSelectedImage

    //Controls menu button
	mainButton2 = new mainMenuButtons.Sprite(w/2,h  /2 + 100, 500,100,`rectangle`)
	mainButton2.color = `#5b5b5b`
	mainButton2.defaultColor = `#5b5b5b`
	mainButton2.selectedColour = `#999999`
	mainButton2.defaultImage = controlsButtonImage
	mainButton2.selectedImage = controlsButtonSelectedImage

    mainSelectedButton = 0
    mainMenuButtons[0].color = `#999999`
    mainSelectedButtonRange = [0,mainMenuButtons.length-1]
    mainMenuNavigationParameters = [`main`,mainSelectedButton,mainSelectedButtonRange,mainMenuButtons]
}

//Inventory Menu
let inventoryMenu
let inventoryMenuButtons
let inventoryMenuNavigationParameters = []
let inventorySelectedButton = 0
let inventorySelectedButtonRange

// Placeholder booleans for each box (true = show, false = hide)
let inventoryBoxStates = [
    true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true
    // Add more as needed for your menu layout
]

function inventoryMenuSetup() {
    inventoryMenu = new Group()
    inventoryMenuButtons = new inventoryMenu.Group()

    // Example layout: 5 columns x 4 rows
    let boxWidth = 80
    let boxHeight = 80
    let startX = windowWidth/2 - 2.5*boxWidth
    let startY = windowHeight/2 - 2*boxHeight
    let idx = 0
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            let showBox = inventoryBoxStates[idx] // placeholder boolean
            if (showBox) {
                let x = startX + col*boxWidth
                let y = startY + row*boxHeight
                let button = new inventoryMenuButtons.Sprite(x, y, boxWidth, boxHeight, 'rectangle')
                button.color = '#5b5b5b'
                button.defaultColor = '#5b5b5b'
                button.selectedColour = '#999999'
                button.defaultImage = null
                button.selectedImage = null
                button.tag = idx
            }
            idx++
        }
    }
    inventorySelectedButtonRange = [0, inventoryMenuButtons.length-1]
    inventorySelectedButton = 0
    if (inventoryMenuButtons.length > 0) inventoryMenuButtons[0].color = '#999999'
    inventoryMenuNavigationParameters = ['inventory', inventorySelectedButton, inventorySelectedButtonRange, inventoryMenuButtons]
}

//SaveFilesMenu
let saveFileMenuNavigationParameters = []

let saveFileMenu
let saveFileMenuButtons

let saveFileMenuBackground
let saveFileButton1
let saveFileButton2
let saveFileButton3
let saveFileButton4
let saveFileButton5
let saveFileButton6
let saveFileButton7
let saveFileButton8

let saveFileSelectedButton = 0
let saveFileSelectedButtonRange = [0,3]

async function saveFileMenuSetup(){ // Initialize save file menu and save file menu buttons
    // Validate windowWidth and windowHeight before using them
    let w = windowWidth || window.innerWidth || 1024
    let h = windowHeight || window.innerHeight || 768
    w = Math.max(1, Math.min(Number.isFinite(w) ? parseInt(w) : 1024, 4096))
    h = Math.max(1, Math.min(Number.isFinite(h) ? parseInt(h) : 768, 4096))

    saveFileMenu = new Group()
    saveFileMenuButtons = new saveFileMenu.Group()

    saveFileMenuBackground = new saveFileMenu.Sprite(w/2, h/2, w, h, `rectangle`)
    saveFileMenuBackground.color = `#444444`

    // Save file 1 button
    saveFileButton1 = new saveFileMenuButtons.Sprite(w/2 - 100, h/2 - 180, 700, 100, `rectangle`)        
    saveFileButton1.color = `#5b5b5b`
    saveFileButton1.defaultColor = `#5b5b5b`
    saveFileButton1.selectedColour = `#999999`
    saveFileButton1.defaultImage = null
    saveFileButton1.selectedImage = null

    // Save file 2 button
    saveFileButton2 = new saveFileMenuButtons.Sprite(w/2 - 100, h/2 - 60, 700, 100, `rectangle`)
    saveFileButton2.color = `#5b5b5b`
    saveFileButton2.defaultColor = `#5b5b5b`
    saveFileButton2.selectedColour = `#999999`
    saveFileButton2.defaultImage = null
    saveFileButton2.selectedImage = null

    // Save file 3 button
    saveFileButton3 = new saveFileMenuButtons.Sprite(windowWidth/2 - 100,windowHeight/2 + 60, 700,100,`rectangle`)
    saveFileButton3.color = `#5b5b5b`
    saveFileButton3.defaultColor = `#5b5b5b`
    saveFileButton3.selectedColour = `#999999`
    saveFileButton3.defaultImage = null
    saveFileButton3.selectedImage = null

    // Save file 4 button
    saveFileButton4 = new saveFileMenuButtons.Sprite(windowWidth/2 - 100,windowHeight/2 + 180, 700,100,`rectangle`)
    saveFileButton4.color = `#5b5b5b`
    saveFileButton4.defaultColor = `#5b5b5b`
    saveFileButton4.selectedColour = `#999999`
    saveFileButton4.defaultImage = null
    saveFileButton4.selectedImage = null

    // Delete save file 1 button
    saveFileButton5 = new saveFileMenuButtons.Sprite(windowWidth/2 + 325,windowHeight/2 - 180,100,100,`rectangle`)
    saveFileButton5.color = `#5b5b5b`
    saveFileButton5.defaultColor = `#5b5b5b`
    saveFileButton5.selectedColour = `#999999`
    saveFileButton5.defaultImage = null
    saveFileButton5.selectedImage = null

    // Delete save file 2 button
    saveFileButton6 = new saveFileMenuButtons.Sprite(windowWidth/2 + 325,windowHeight/2 - 60, 100,100,`rectangle`)
    saveFileButton6.color = `#5b5b5b`
    saveFileButton6.defaultColor = `#5b5b5b`
    saveFileButton6.selectedColour = `#999999`
    saveFileButton6.defaultImage = null
    saveFileButton6.selectedImage = null    

    // Delete save file 3 button
    saveFileButton7 = new saveFileMenuButtons.Sprite(windowWidth/2 + 325,windowHeight/2 + 60, 100,100,`rectangle`)  
    saveFileButton7.color = `#5b5b5b`
    saveFileButton7.defaultColor = `#5b5b5b`
    saveFileButton7.selectedColour = `#999999`
    saveFileButton7.defaultImage = null
    saveFileButton7.selectedImage = null

    // Delete save file 4 button
    saveFileButton8 = new saveFileMenuButtons.Sprite(windowWidth/2 + 325,windowHeight/2 + 180, 100,100,`rectangle`)     
    saveFileButton8.color = `#5b5b5b`
    saveFileButton8.defaultColor = `#5b5b5b`
    saveFileButton8.selectedColour = `#999999`
    saveFileButton8.defaultImage = null
    saveFileButton8.selectedImage = null

    // Read save files (async) and assign images based on fileType
    let save1Data
    let save2Data
    let save3Data
    let save4Data
    save1Data = await readSaveData(1)
    save2Data = await readSaveData(2)
    save3Data = await readSaveData(3)
    save4Data = await readSaveData(4)
    console.log(`Save 1 file type: ` + save1Data.fileType)
    console.log(`Save 2 file type: ` + save2Data.fileType)  
    console.log(`Save 3 file type: ` + save3Data.fileType)
    console.log(`Save 4 file type: ` + save4Data.fileType)
    // Slot 1
    if(save1Data.fileType == `normal`){
        saveFileButton1.defaultImage = saveFile1Image
        saveFileButton1.selectedImage = saveFile1SelectedImage
    }
    else if(save1Data.fileType == `steelsoul`){
        saveFileButton1.defaultImage = saveFile1SteelSoulImage
        saveFileButton1.selectedImage = saveFile1SteelSoulSelectedImage
    }
    else if(save1Data.fileType == `steelsoulbroken`){
        saveFileButton1.defaultImage = saveFile1SteelSoulBrokenImage
        saveFileButton1.selectedImage = saveFile1SteelSoulBrokenSelectedImage
    }
    else if(save1Data.fileType == `empty`){
        saveFileButton1.defaultImage = saveFileBlankImage
        saveFileButton1.selectedImage = saveFileBlankSelectedImage

    }
    else {
        console.log(`Unknown file type for save slot 1: ` + save1Data.fileType)
    }
    // Slot 2
    if(save2Data.fileType == `normal`){
        saveFileButton2.defaultImage = saveFile2Image
        saveFileButton2.selectedImage = saveFile2SelectedImage
    }
    else if(save2Data.fileType == `steelsoul`){
        saveFileButton2.defaultImage = saveFile2SteelSoulImage
        saveFileButton2.selectedImage = saveFile2SteelSoulSelectedImage
    }
    else if(save2Data.fileType == `steelsoulbroken`){
        saveFileButton2.defaultImage = saveFile2SteelSoulBrokenImage
        saveFileButton2.selectedImage = saveFile2SteelSoulBrokenSelectedImage
    }
    else if(save2Data.fileType == `empty`){
        saveFileButton2.defaultImage = saveFileBlankImage
        saveFileButton2.selectedImage = saveFileBlankSelectedImage
    }
    else{
        console.log(`Unknown file type for save slot 2: ` + save2Data.fileType)
        saveFileButton2.defaultImage = null
        saveFileButton2.selectedImage = null
    }
    // Slot 3
    if(save3Data.fileType == `normal`){
        saveFileButton3.defaultImage = saveFile3Image
        saveFileButton3.selectedImage = saveFile3SelectedImage
    }
    else if(save3Data.fileType == `steelsoul`){
        saveFileButton3.defaultImage = saveFile3SteelSoulImage
        saveFileButton3.selectedImage = saveFile3SteelSoulSelectedImage
    }
    else if(save3Data.fileType == `steelsoulbroken`){
        saveFileButton3.defaultImage = saveFile3SteelSoulBrokenImage
        saveFileButton3.selectedImage = saveFile3SteelSoulBrokenSelectedImage
    }
    else if(save3Data.fileType == `empty`){
        saveFileButton3.defaultImage = saveFileBlankImage
        saveFileButton3.selectedImage = saveFileBlankSelectedImage
    }
    else{
        console.log(`Unknown file type for save slot 3: ` + save3Data.fileType)
        saveFileButton3.defaultImage = null
        saveFileButton3.selectedImage = null
    }   

    // Slot 4
    if(save4Data.fileType == `normal`){ 
        saveFileButton4.defaultImage = saveFile4Image
        saveFileButton4.selectedImage = saveFile4SelectedImage
    }
    else if(save4Data.fileType == `steelsoul`){
        saveFileButton4.defaultImage = saveFile4SteelSoulImage
        saveFileButton4.selectedImage = saveFile4SteelSoulSelectedImage
    }
    else if(save4Data.fileType == `steelsoulbroken`){
        saveFileButton4.defaultImage = saveFile4SteelSoulBrokenImage
        saveFileButton4.selectedImage = saveFile4SteelSoulBrokenSelectedImage
    }
    else if(save4Data.fileType == `empty`){
        saveFileButton4.defaultImage = saveFileBlankImage
        saveFileButton4.selectedImage = saveFileBlankSelectedImage
    }
    else{
        console.log(`Unknown file type for save slot 4: ` + save4Data.fileType)
        saveFileButton4.defaultImage = null
        saveFileButton4.selectedImage = null
    }

    saveFileSelectedButton = 0
    if(saveFileMenuButtons.length > 0) saveFileMenuButtons[0].color = `#999999`
    saveFileSelectedButtonRange = [0,saveFileMenuButtons.length-1]
    saveFileMenuNavigationParameters = [`saveFile`,saveFileSelectedButton,saveFileSelectedButtonRange,saveFileMenuButtons]
}

//Pause Menu 
let pauseMenu
let pauseMenuButtons

let pauseMenuNavigationParameters = []

let pauseMenuBackground
let pauseButton1
let pauseButton2
let pauseButton3

let pauseSelectedButton = 0
let pauseSelectedButtonRange = [0,2]

function pauseMenuSetup(){ // Initialize pause menu and pause menu buttons
    // Validate windowWidth and windowHeight before using them
    let w = windowWidth || window.innerWidth || 1024
    let h = windowHeight || window.innerHeight || 768
    w = Math.max(1, Math.min(Number.isFinite(w) ? parseInt(w) : 1024, 4096))
    h = Math.max(1, Math.min(Number.isFinite(h) ? parseInt(h) : 768, 4096))

    pauseMenu = new Group()
    pauseMenuButtons = new pauseMenu.Group()

 	pauseMenuBackground = new pauseMenu.Sprite(w/2,h/2,w,h,`rectangle`)
	pauseMenuBackground.color = `#444444`
    pauseMenuBackground.opacity = 0.5

    //Resume game button
	pauseButton1 = new pauseMenuButtons.Sprite(w/2,h/2 - 150,500,100,`rectangle`)		
    pauseButton1.color = `#5b5b5b`
	pauseButton1.defaultColor = `#5b5b5b`
	pauseButton1.selectedColour = `#999999`
	pauseButton1.defaultImage = null
	pauseButton1.selectedImage = null
    // Controls menu button
	pauseButton2 = new pauseMenuButtons.Sprite(w/2,h/2, 500,100,`rectangle`)
	pauseButton2.color = `#5b5b5b`
	pauseButton2.defaultColor = `#5b5b5b`
	pauseButton2.selectedColour = `#999999`
	pauseButton2.defaultImage = null
	pauseButton2.selectedImage = null
    	
    // Save and exit button
    pauseButton3 = new pauseMenuButtons.Sprite(w/2,h/2 + 150, 500,100,`rectangle`)
	pauseButton3.color = `#5b5b5b`
	pauseButton3.defaultColor = `#5b5b5b`
	pauseButton3.selectedColour = `#999999`
	pauseButton3.defaultImage = null
	pauseButton3.selectedImage = null

    pauseSelectedButton = 0
    pauseMenuButtons[0].color = `#999999`
    pauseSelectedButtonRange = [0,pauseMenuButtons.length-1]
    pauseMenuNavigationParameters = [`pause`,pauseSelectedButton,pauseSelectedButtonRange,pauseMenuButtons,]
}

//Control Menu
let controlsMenu
let controlsMenuButtons

let controlsMenuNavigationParameters = []

let controlsMenuBackground

let controlsSelectedButton = 0
let controlsSelectedButtonRange 

function controlsMenuSetup(){ // Initialize controls menu and controls menu buttons
    console.log(`setting up controls menu`)
    controlsMenu = new Group()
    controlsMenuButtons = new controlsMenu.Group()

    controlsMenuBackground = new controlsMenu.Sprite(windowWidth/2,windowHeight/2,windowWidth,windowHeight,`rectangle`)
    controlsMenuBackground.color = `#444444`

    // Create a temporary copy of controls to mutate while the user rebinding
    tempControls = JSON.parse(JSON.stringify(controls))

    for (let i = 0 ; i < tempControls.length ; i++){
        let button = new controlsMenuButtons.Sprite(windowWidth/2,0,500,80,`rectangle`)
        button.tag = i
        button.color = `#5b5b5b`
        button.defaultColor = `#5b5b5b`
        button.selectedColour = `#999999`
        button.action = tempControls[i][0]
        button.key1 = tempControls[i][1][0]
        button.key2 = tempControls[i][1][1]
        button.defaultImage = null
        button.selectedImage = null
    }

    // Add two static action buttons at the bottom: Save and Close Menu
    let saveButton = new controlsMenuButtons.Sprite(windowWidth/2 - 150, 0, 200, 80, `rectangle`)
    saveButton.color = `#5b5b5b`
    saveButton.defaultColor = `#5b5b5b`
    saveButton.selectedColour = `#999999`
    saveButton.action = `save`
    saveButton.key1 = ``
    saveButton.key2 = ``
    saveButton.defaultImage = null
    saveButton.selectedImage = null

    let closeMenuButton = new controlsMenuButtons.Sprite(windowWidth/2 + 150, 0, 200, 80, `rectangle`)
    closeMenuButton.color = `#5b5b5b`
    closeMenuButton.defaultColor = `#5b5b5b`
    closeMenuButton.selectedColour = `#999999`
    closeMenuButton.action = `close menu`
    closeMenuButton.key1 = ``
    closeMenuButton.key2 = ``
    closeMenuButton.defaultImage = null
    closeMenuButton.selectedImage = null

    controlsSelectedButtonRange = [0,controlsMenuButtons.length-1]

    //Set Initial Positions
    for(i = 0 ; i < controlsMenuButtons.length ; i++){
        controlsMenuButtons[i].x = windowWidth/2
        // Stack the controls list and keep the two action buttons pinned near the bottom
        if(i < controls.length){
            controlsMenuButtons[i].y = (windowHeight/2 - (controlsMenuButtons[i].height/2 + 200) + (i*120))
        }
        else{
            // position the extra buttons below the list
            let extraIndex = i - controls.length
            controlsMenuButtons[i].y = (windowHeight/2 + 220 + (extraIndex * 120))
        }
    }

    // If we added two action buttons at the end, place them side-by-side near the bottom
    if(controlsMenuButtons.length >= controls.length + 2){
        let n = controlsMenuButtons.length
        // penultimate is save, last is close menu (as created earlier)
        controlsMenuButtons[n-2].x = windowWidth/2 - 150
        controlsMenuButtons[n-1].x = windowWidth/2 + 150
        controlsMenuButtons[n-2].y = windowHeight/2 + 220
        controlsMenuButtons[n-1].y = windowHeight/2 + 220
    }

    controlsSelectedButton = 0
    controlsMenuButtons[0].color = `#999999`
    controlsSelectedButtonRange = [0,controlsMenuButtons.length-1]
    controlsMenuNavigationParameters = [`controls`,controlsSelectedButton,controlsSelectedButtonRange,controlsMenuButtons,]
}

function updateControlButtonsPositions(){
    for(i = 0 ; i < controlsMenuButtons.length ; i++){
        controlsMenuButtons[i].x = windowWidth/2
        controlsMenuButtons[i].y = (windowHeight/2 - (controlsMenuButtons[i].height/2 + 200) + (i*120) - (controlsMenuNavigationParameters[1]*120))
    }
}

function drawButtonLabels(){
    for(i = 0 ; i < controlsMenuButtons.length ; i++){
        // draw labels for each control button
        fill(`white`);
        textAlign(CENTER);
        textSize(20);
        // Build a label: show action and any non-empty keys
        let label = `` + controlsMenuButtons[i].action
        // If this button is currently being rebound, show prompt
        if(rebindTarget !== null && i === rebindTarget){
            label = controlsMenuButtons[i].action + ` : press a key...`
        }
        else{
            if(controlsMenuButtons[i].key1 !== undefined && controlsMenuButtons[i].key1 !== ``){
                label += ` | ` + controlsMenuButtons[i].key1
            }
            if(controlsMenuButtons[i].key2 !== undefined && controlsMenuButtons[i].key2 !== ``){
                label += ` | ` + controlsMenuButtons[i].key2
            }
        }
        text(label, controlsMenuButtons[i].x, controlsMenuButtons[i].y);
    }
}


// Death Menu
let deathMenu
let deathMenuButtons

let deathMenuNavigationParameters = []

let deathMenuBackground
let deathButton1
let deathButton2

let deathSelectedButton = 0
let deathSelectedButtonRange = [0,1]

function deathMenuSetup() { // Initialize death menu and death menu buttons
    deathMenu = new Group()
    deathMenuButtons = new deathMenu.Group()

    deathMenuBackground = new deathMenu.Sprite(windowWidth/2, windowHeight/2, windowWidth, windowHeight, 'rectangle')
    deathMenuBackground.color = '#444444'

    // Try Again button
    deathButton1 = new deathMenuButtons.Sprite(windowWidth/2, windowHeight/2 - 100, 500, 100, 'rectangle')
    deathButton1.color = '#5b5b5b'
    deathButton1.defaultColor = '#5b5b5b'
    deathButton1.selectedColour = '#999999'
    deathButton1.defaultImage = null
    deathButton1.selectedImage = null

    // Main Menu button  
    deathButton2 = new deathMenuButtons.Sprite(windowWidth/2, windowHeight/2 + 100, 500, 100, 'rectangle')
    deathButton2.color = '#5b5b5b'
    deathButton2.defaultColor = '#5b5b5b'
    deathButton2.selectedColour = '#999999'
    deathButton2.defaultImage = null
    deathButton2.selectedImage = null

    deathSelectedButton = 0
    deathMenuButtons[0].color = '#999999'
    deathSelectedButtonRange = [0,1]
    deathMenuNavigationParameters = ['death', deathSelectedButton, deathSelectedButtonRange, deathMenuButtons]
    
}

function drawDeathMenuLabels() {
    // Draw Game Over text
    fill('white')
    textAlign(CENTER)
    textSize(50)
    text('GAME OVER', windowWidth/2, windowHeight/3)
    
    // Draw button labels
    textSize(20)
    text('Try Again', deathButton1.x, deathButton1.y)
    text('Main Menu', deathButton2.x, deathButton2.y)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Menu Open/Close Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pause(){ 
    //Stop physics time by activating pause state and record the current time 
    gamestate = `paused`
	paused = true
	pauseStart = world.realTime
	world.timeScale = 0
	setup()
}

function unpause(){
    // Resume physics time by restoring playing state and calculating pause duration
    gamestate = `playing`
	paused = false
	pauseEnd = world.realTime
	pauseDuration = pauseEnd - pauseStart
	world.timeScale = 1

    // Reschedule any timeout functions that were called during the game pause
	for(i = 0; i < scheduledUnpauseFunctions.length; i++){
		setTimeout(scheduledUnpauseFunctions[i][0],scheduledUnpauseFunctions[i][1])
	}

    //Close the pause menu
    pauseMenu.remove()

}

function openDeathMenu(){
    console.log(`opening death menu`)
    lastGamestate = gamestate
    gamestate = `gameOver`
    setup()
}

function closeDeathMenu(){
    console.log(`closing death menu`)
    deathMenu.remove()
    console.log(`removed all`)
}   

function openSaveFileMenu(){
    console.log(`opening save file menu`)
    lastGamestate = gamestate
    closeMainMenu()
    gamestate = `saveFile`
    setup()
}
async function closeSaveFileMenu(){
    console.log(`closing save file menu`)
    await saveData(saveFile)
    saveFileMenu.remove()
    console.log(`removed all`)
}

function openControlsMenu(){
    console.log(`opening controls menu`)
    lastGamestate = gamestate
    gamestate = `controls`
    setup()
}
function closeControlsMenu(){
    //Cleat control menu sprites and return to the last gameState (main menu or pause menu)
    console.log(`closing controls menu`)
    controlsMenu.remove()
    gamestate = lastGamestate
    lastGamestate = controls
}

function openMainMenu(){
    //Clear all sprites and reset gameState to main menu
    console.log(`opening main menu`)
    allSprites.remove()
    lastGamestate = gamestate
    gamestate = `main`
    setup()
}

function closeMainMenu(){
    mainMenu.remove()
    console.log(`removed all`)
}
function openInventory(){
    //Open inventory menu and set gamestate to inventory
    console.log(`opening inventory`)
    lastGamestate = gamestate
    gamestate = `inventory`
    setup()
}
function closeInventory(){
    console.log(`closing inventory`)
    inventoryMenu.remove()
    gamestate = lastGamestate
}

async function openSaveFile(index){
    
    let saveFileData = await readSaveData(index + 1)
    if(saveFileData.fileType != `steelsoulbroken`){
        lastGamestate = gamestate
        gamestate = `playing`
        saveFile = index + 1
        closeSaveFileMenu()
        setup()
    }
}

function respawnPlayer(){
    //Set health to max
    //teleport to last save position using save position variable
    //set gamestate to playing
    //close death menu

    player.heal(`Max`)
    teleport(player, savePointIndex[currentSaveLocation][1], savePointIndex[currentSaveLocation][2] - (tileSize/2))
    gamestate = `playing`
    closeDeathMenu()
}
