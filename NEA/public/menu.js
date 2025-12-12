function cleanupGameState() {
    // Remove all sprite groups
    if(playingSpriteGroup) {
        playingSpriteGroup.removeAll()
        playingSpriteGroup = undefined
    }
    if(mainMenu) {
        mainMenu.removeAll()
        mainMenu = undefined
    }
    if(pauseMenu) {
        pauseMenu.removeAll()
        pauseMenu = undefined
    }
    if(deathMenu) {
        deathMenu.removeAll()
        deathMenu = undefined
    }
    if(controlsMenu) {
        controlsMenu.removeAll()
        controlsMenu = undefined
    }
    if(inventoryMenu) {
        inventoryMenu.removeAll()
        inventoryMenu = undefined
    }
    // Remove any remaining sprites
    allSprites.removeAll()
}

function menuInputs(navigationParameters){
    // Popup handling: if a new-save or delete-confirm popup is open, handle its buttons first
    if(newSavePopup){
        for(let i = 0; i < newSavePopup.length; i++){
            let s = newSavePopup[i]
            if(s.action && mouse.presses() && s.mouse.hovering()){
                if(s.action == `regular`){
                    // create new save and start game
                    let slot = pendingSaveIndex
                    createNewSaveFromBlank(slot, false).then(() => {
                        saveFile = slot
                        lastGamestate = gamestate
                        gamestate = `playing`
                        closeSaveFileMenu()
                        setup()
                    })
                }
                else if(s.action == `steelsoul`){
                    let slot = pendingSaveIndex
                    createNewSaveFromBlank(slot, true).then(() => {
                        saveFile = slot
                        lastGamestate = gamestate
                        gamestate = `playing`
                        closeSaveFileMenu()
                        setup()
                    })
                }
                return
            }
        }
    }
    if(deleteConfirmPopup){
        for(let i = 0; i < deleteConfirmPopup.length; i++){
            let s = deleteConfirmPopup[i]
            if(s.action && mouse.presses() && s.mouse.hovering()){
                if(s.action == `confirmDelete`){
                    overwriteWithBlank(pendingSaveIndex)
                }
                else if(s.action == `cancelDelete`){
                    hideDeleteConfirmPopup()
                }
                return
            }
        }
    }
    if(kb.presses(`down`)){
        navigationParameters[1] += 1
        //Loop if above max range
        if(navigationParameters[1] > navigationParameters[2][1]){
            navigationParameters[1] = navigationParameters[2][0]
        }

        for(i = 0 ; i <= navigationParameters[2][1] ; i++){
            navigationParameters[3][i].color = navigationParameters[3][i].defaultColor
            if(i == navigationParameters[1]){
                navigationParameters[3][i].color = `#999999`
            }
        }
    }
    else if(kb.presses(`up`)){
        navigationParameters[1] -= 1
        //Loop if below min range
        if(navigationParameters[1] < navigationParameters[2][0]){
            navigationParameters[1] = navigationParameters[2][1]
        }

        for(i = 0 ; i <= navigationParameters[2][1] ; i++){
            navigationParameters[3][i].color = navigationParameters[3][i].defaultColor
            if(i == navigationParameters[1]){
                navigationParameters[3][i].color = `#999999`
            }
        }
    }
    if(kb.pressed(`ENTER`)){
        activateButton(navigationParameters[1],navigationParameters[0])
    }
    if(mouse.presses()){
        for(let i = 0 ; i <= navigationParameters[2][1] ; i ++){
            if(navigationParameters[3][i].mouse.hovering()){
                for(let j = 0 ; j <= navigationParameters[2][1] ; j++){
                    navigationParameters[3][j].color = navigationParameters[3][j].defaultColor
                }
                navigationParameters[3][i].color = `#999999`

                navigationParameters[1] = i
                activateButton(navigationParameters[1],navigationParameters[0])
            }
        }
    }

}



function activateButton(index,menu){
    if(menu == `main`){
        if(index == 0){
            openSaveFileMenu()
        }
        else if(index == 1){
            openControlsMenu()
        }
    }
    else if(menu == `saveFile`){
        // saveFileMenuButtons arranged as [slot1_main, slot1_delete, slot2_main, slot2_delete, ...]
        if(index % 2 == 0){
            // main button pressed
            let slot = (index / 2) + 1
            // if slot is blank, prompt for new save creation
            if(saveFileIsBlank[slot-1]){
                showNewSavePopup(slot)
            }
            else{
                // Open existing save
                lastGamestate = gamestate
                gamestate = `playing`
                saveFile = slot
                closeSaveFileMenu()
                setup()
            }
        }
        else{
            // delete button pressed
            let slot = ((index - 1) / 2) + 1
            let delSprite = saveFileMenuButtons[index]
            if(delSprite && delSprite.enabled){
                showDeleteConfirmPopup(slot)
            }
        }
    }
    else if(menu == `pause`){
        if(index == 0){
            unpause()
        }
        else if(index == 1){
            openControlsMenu()
        }
        else if(index == 2){
            saveData(saveFile)
            allSprites.remove()
            openMainMenu()
        }
    }
    else if(menu == `death`){
        if(index == 0){
            // Try Again
            cleanupGameState()
            // Reset all game state variables
            currentHealth = maxHealth
            immune = false
            movementLocked = false
            heightLocked = false
            dashCharged = true
            dashCold = true
            doubleJumpCharged = true
            doubleJumpCold = true
            paused = false
            world.timeScale = 1
            
            // Clean up all sprites and groups before restart
            if(playingSpriteGroup) {
                playingSpriteGroup.removeAll()
                playingSpriteGroup = undefined
            }
            if(deathMenu) {
                deathMenu.removeAll()
                deathMenu = undefined
            }
            allSprites.removeAll()
            
            // Clean up tiles and chunks
            cleanupTileSystem()
            
            // Reset game
            gamestate = `playing`
            setup()
        }
        else if(index == 1){
            // Main Menu
            cleanupGameState()
            // Clean up tiles and chunks
            cleanupTileSystem()
            world.timeScale = 1
            gamestate = `main`
            setup()
        }
    }
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
                    updateContols()
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


//Main Menu
let mainMenu
let mainMenuButtons

let mainMenuNavigationParameters = []

let mainMenuBackground
let mainButton1
let mainButton2

let mainSelectedButton
let mainSelectedButtonRange = [0,1]

function mainMenuSetup(){
    mainMenu = new Group()
    mainMenuButtons = new mainMenu.Group()

 	mainMenuBackground = new mainMenu.Sprite(windowWidth/2,windowHeight/2,windowWidth,windowHeight,`rectangle`)
	mainMenuBackground.color = `#444444`

	mainButton1 = new mainMenuButtons.Sprite(windowWidth/2,windowHeight/2 - 100,500,100,`rectangle`)		
    mainButton1.color = `#5b5b5b`
	mainButton1.defaultColor = `#5b5b5b`

	mainButton2 = new mainMenuButtons.Sprite(windowWidth/2,windowHeight/2 + 100, 500,100,`rectangle`)
	mainButton2.color = `#5b5b5b`
	mainButton2.defaultColor = `#5b5b5b`

    mainSelectedButton = 0
    mainMenuButtons[0].color = `#999999`
    mainSelectedButtonRange = [0,mainMenuButtons.length-1]
    mainMenuNavigationParameters = [`main`,mainSelectedButton,mainSelectedButtonRange,mainMenuButtons]
}

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

        // Normalize Space -> Space for display
        if(keyName === ' ') keyName = 'Space'

        // Prevent binding of Enter/Escape used for UI control (optional)
        if(keyName === 'Enter' || keyName === 'Escape'){
            // treat as cancel
            cancelRebind()
            return
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

function closeControlsMenu(){
    // Close the controls menu and return to previous state
    controlsMenu.remove()
    // restore gamestate to lastGamestate if set
    if(typeof lastGamestate !== 'undefined'){
        gamestate = lastGamestate
    } else {
        gamestate = `main`
    }
    setup()
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

    // Example layout: 5 columns x 4 rows (adjust as needed)
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

let saveFileSelectedButton = 0
let saveFileSelectedButtonRange = [0,3]

// Track save-file state and popups
let saveFileIsBlank = [true, true, true, true]
let saveFileChecked = false
let newSavePopup = null
let deleteConfirmPopup = null
let pendingSaveIndex = null

async function checkSaveFilesStatus(){
    // Populate saveFileIsBlank by attempting to read each save; treat failures as blank
    for(let i = 1; i <= 4; i++){
        try{
            let data = await readSaveData(i)
            // If readSaveData returns a valid object, assume not blank
            if(data && typeof data === 'object'){
                saveFileIsBlank[i-1] = false
            }
            else{
                saveFileIsBlank[i-1] = true
            }
        }
        catch(e){
            saveFileIsBlank[i-1] = true
        }
    }
    saveFileChecked = true
    // Update delete button visuals if menu exists
    if(saveFileMenuButtons){
        for(let i = 0; i < 4; i++){
            let delSprite = saveFileMenuButtons[i*2+1]
            if(delSprite){
                if(saveFileIsBlank[i]){
                    delSprite.color = `#333333`
                    delSprite.defaultColor = `#333333`
                    delSprite.enabled = false
                }
                else{
                    delSprite.color = `#5b5b5b`
                    delSprite.defaultColor = `#5b5b5b`
                    delSprite.enabled = true
                }
            }
        }
    }
}

function showNewSavePopup(slot){
    // create a simple popup group asking Regular or Steel Soul
    newSavePopup = new Group()
    let bg = new newSavePopup.Sprite(windowWidth/2, windowHeight/2, 400, 200, `rectangle`)
    bg.color = `#222222`
    bg.defaultColor = `#222222`
    let btn1 = new newSavePopup.Sprite(windowWidth/2 - 80, windowHeight/2 + 40, 140, 50, `rectangle`)
    btn1.color = `#5b5b5b`
    btn1.action = `regular`
    let btn2 = new newSavePopup.Sprite(windowWidth/2 + 80, windowHeight/2 + 40, 140, 50, `rectangle`)
    btn2.color = `#5b5b5b`
    btn2.action = `steelsoul`
    pendingSaveIndex = slot
}
function hideNewSavePopup(){
    if(newSavePopup){ newSavePopup.remove(); newSavePopup = null }
    pendingSaveIndex = null
}

function showDeleteConfirmPopup(slot){
    deleteConfirmPopup = new Group()
    let bg = new deleteConfirmPopup.Sprite(windowWidth/2, windowHeight/2, 420, 180, `rectangle`)
    bg.color = `#222222`
    let btnYes = new deleteConfirmPopup.Sprite(windowWidth/2 - 80, windowHeight/2 + 40, 120, 50, `rectangle`)
    btnYes.color = `#5b5b5b`
    btnYes.action = `confirmDelete`
    let btnNo = new deleteConfirmPopup.Sprite(windowWidth/2 + 80, windowHeight/2 + 40, 120, 50, `rectangle`)
    btnNo.color = `#5b5b5b`
    btnNo.action = `cancelDelete`
    pendingSaveIndex = slot
}
function hideDeleteConfirmPopup(){
    if(deleteConfirmPopup){ deleteConfirmPopup.remove(); deleteConfirmPopup = null }
    pendingSaveIndex = null
}

async function createNewSaveFromBlank(slot, steelSoulChoice){
    // Read blank file, set steelSoul, and write to target slot
    try{
        let encryptedBlank = await callReadData(`Savefiles/saveFileBlank.txt`)
        let plain = await decryptData(encryptedBlank)
        let obj = JSON.parse(plain)
        obj.steelSoul = !!steelSoulChoice
        let newEncrypted = await encryptData(JSON.stringify(obj))
        let filepath = `Savefiles/saveFileOne.txt`
        if(slot == 2) filepath = `Savefiles/saveFileTwo.txt`
        else if(slot == 3) filepath = `Savefiles/saveFileThree.txt`
        else if(slot == 4) filepath = `Savefiles/saveFileFour.txt`
        callWriteData(filepath, newEncrypted)
        saveFileIsBlank[slot-1] = false
        hideNewSavePopup()
        // update UI delete button if present
        if(saveFileMenuButtons && saveFileMenuButtons[(slot-1)*2+1]){
            let d = saveFileMenuButtons[(slot-1)*2+1]
            d.color = `#5b5b5b`
            d.defaultColor = `#5b5b5b`
            d.enabled = true
        }
    }
    catch(e){
        console.log(`Failed to create new save: `, e)
    }
}

async function overwriteWithBlank(slot){
    try{
        let encryptedBlank = await callReadData(`Savefiles/saveFileBlank.txt`)
        let filepath = `Savefiles/saveFileOne.txt`
        if(slot == 2) filepath = `Savefiles/saveFileTwo.txt`
        else if(slot == 3) filepath = `Savefiles/saveFileThree.txt`
        else if(slot == 4) filepath = `Savefiles/saveFileFour.txt`
        callWriteData(filepath, encryptedBlank)
        saveFileIsBlank[slot-1] = true
        hideDeleteConfirmPopup()
        // update delete button visual
        if(saveFileMenuButtons && saveFileMenuButtons[(slot-1)*2+1]){
            let d = saveFileMenuButtons[(slot-1)*2+1]
            d.color = `#333333`
            d.defaultColor = `#333333`
            d.enabled = false
        }
    }
    catch(e){ console.log(`Failed to overwrite: `, e) }
}
function saveFileMenuSetup(){

    saveFileMenu = new Group()
    saveFileMenuButtons = new saveFileMenu.Group()

    saveFileMenuBackground = new saveFileMenu.Sprite(windowWidth/2,windowHeight/2,windowWidth,windowHeight,`rectangle`)
    saveFileMenuBackground.color = `#444444`

    // For each save slot create a main button + a small delete button
    let baseY = windowHeight/2 - 250
    for(let s = 0; s < 4; s++){
        let y = baseY + s*150
        let main = new saveFileMenuButtons.Sprite(windowWidth/2, y, 500, 100, `rectangle`)
        main.color = `#5b5b5b`
        main.defaultColor = `#5b5b5b`
        main.tag = s+1
        main.action = `open`
        // small delete button to the right
        let del = new saveFileMenuButtons.Sprite(windowWidth/2 + 280, y, 50, 50, `rectangle`)
        // default to disabled look until status check runs
        del.color = saveFileIsBlank[s] ? `#333333` : `#5b5b5b`
        del.defaultColor = del.color
        del.tag = s+1
        del.action = `delete`
        del.enabled = !saveFileIsBlank[s]
    }

    saveFileSelectedButton = 0
    if(saveFileMenuButtons.length > 0) saveFileMenuButtons[0].color = `#999999`
    saveFileSelectedButtonRange = [0,saveFileMenuButtons.length-1]
    saveFileMenuNavigationParameters = [`saveFile`,saveFileSelectedButton,saveFileSelectedButtonRange,saveFileMenuButtons]

    // Kick off async status check to enable delete buttons appropriately
    checkSaveFilesStatus()
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

function pauseMenuSetup(){
    pauseMenu = new Group()
    pauseMenuButtons = new pauseMenu.Group()

 	pauseMenuBackground = new pauseMenu.Sprite(windowWidth/2,windowHeight/2,windowWidth,windowHeight,`rectangle`)
	pauseMenuBackground.color = `#444444`
    pauseMenuBackground.opacity = 0.5

	pauseButton1 = new pauseMenuButtons.Sprite(windowWidth/2,windowHeight/2 - 150,500,100,`rectangle`)		
    pauseButton1.color = `#5b5b5b`
	pauseButton1.defaultColor = `#5b5b5b`

	pauseButton2 = new pauseMenuButtons.Sprite(windowWidth/2,windowHeight/2, 500,100,`rectangle`)
	pauseButton2.color = `#5b5b5b`
	pauseButton2.defaultColor = `#5b5b5b`
    	
    pauseButton3 = new pauseMenuButtons.Sprite(windowWidth/2,windowHeight/2 + 150, 500,100,`rectangle`)
	pauseButton3.color = `#5b5b5b`
	pauseButton3.defaultColor = `#5b5b5b`

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

function controlsMenuSetup(){
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
        button.action = tempControls[i][0]
        button.key1 = tempControls[i][1][0]
        button.key2 = tempControls[i][1][1]
    }

    // Add two static action buttons at the bottom: Save and Close Menu
    let saveButton = new controlsMenuButtons.Sprite(windowWidth/2 - 150, 0, 200, 80, `rectangle`)
    saveButton.color = `#5b5b5b`
    saveButton.defaultColor = `#5b5b5b`
    saveButton.action = `save`
    saveButton.key1 = ``
    saveButton.key2 = ``

    let closeMenuButton = new controlsMenuButtons.Sprite(windowWidth/2 + 150, 0, 200, 80, `rectangle`)
    closeMenuButton.color = `#5b5b5b`
    closeMenuButton.defaultColor = `#5b5b5b`
    closeMenuButton.action = `close menu`
    closeMenuButton.key1 = ``
    closeMenuButton.key2 = ``

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

function deathMenuSetup() {
    deathMenu = new Group()
    deathMenuButtons = new deathMenu.Group()

    deathMenuBackground = new deathMenu.Sprite(windowWidth/2, windowHeight/2, windowWidth, windowHeight, 'rectangle')
    deathMenuBackground.color = '#444444'

    // Try Again button
    deathButton1 = new deathMenuButtons.Sprite(windowWidth/2, windowHeight/2 - 100, 500, 100, 'rectangle')
    deathButton1.color = '#5b5b5b'
    deathButton1.defaultColor = '#5b5b5b'

    // Main Menu button  
    deathButton2 = new deathMenuButtons.Sprite(windowWidth/2, windowHeight/2 + 100, 500, 100, 'rectangle')
    deathButton2.color = '#5b5b5b'
    deathButton2.defaultColor = '#5b5b5b'

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

function pause(){
    gamestate = `paused`
	paused = true
	pauseStart = world.realTime
	world.timeScale = 0
	setup()
}

function unpause(){
    gamestate = `playing`
	paused = false
	pauseEnd = world.realTime
	pauseDuration = pauseEnd - pauseStart
	world.timeScale = 1
	for(i = 0; i < scheduledUnpauseFunctions.length; i++){
		setTimeout(scheduledUnpauseFunctions[i][0],scheduledUnpauseFunctions[i][1])
	}
    pauseMenu.remove()

}

function openDeathMenu(){
    lastGamestate = gamestate
    gamestate = `gameOver`
    setup()
}

function closeDeathMenu(){
    deathMenu.remove()
    console.log(`removed all`)
}   

function openSaveFileMenu(index){
    lastGamestate = gamestate
    closeMainMenu()
    gamestate = `saveFile`
    saveFile = index + 1
    setup()
}
async function closeSaveFileMenu(){
    await saveData(saveFile)
    saveFileMenu.remove()
    console.log(`removed all`)
}

function openControlsMenu(){
    lastGamestate = gamestate
    gamestate = `controls`
    setup()
}
function closeControlsMenu(){
    controlsMenu.remove()
    gamestate = lastGamestate
    lastGamestate = controls
}

function openMainMenu(){
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
    console.log(`opening inventory`)
    lastGamestate = gamestate
    gamestate = `inventory`
    setup()
}
function closeInventory(){
    inventoryMenu.remove()
    gamestate = lastGamestate
}

function openSaveFile(index){
    lastGamestate = gamestate
    gamestate = `playing`
    saveFile = index + 1
    closeSaveFileMenu()
    setup()
}
