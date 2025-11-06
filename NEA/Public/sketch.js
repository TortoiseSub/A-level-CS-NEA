////Varaiables
let gamestate = `main`
let playingSpriteGroup

let controls

let heightLocked = false
let lockedHeight = 0

let movementLocked = false
let jumpHacked = false //If true, player can jump even if not on ground

//Pause variables
let pauseStart
let pauseEnd
let pauseDuration 
let paused 
let scheduledUnpauseFunctions = []

//Double jump ability
let doubleJumpUnlocked = true
let doubleJumpCharged
let doubleJumpCold = true
let doubleJumpCooldownTime = 300 //Time in milliseconds before double jump can be used again

//Dash ability
let dashUnlocked = true
let dashCharged
let dashCold = true
let dashCooldownTime = 600 //Time in milliseconds before dash can be used again
let dashDuration = 300

//Wall slide ability
let wallJumpSlideUnlocked = true


//Preload
function preload(){
	//Spritesheets
	//Player sheet
	knightSpriteSheet = loadImage(`Assets/Sprite Sheets/player/Knight Sprite Sheet.png`)

	//HUD Images 
	HUDCasingImg = loadImage(`Assets/HUD/Vessels/HUD Casing.png`)
	shieldImg = loadImage(`Assets/HUD/Health/Shield.png`)
	brokenShieldImg = loadImage(`Assets/HUD/Health/Broken Shield.png`)
	shieldCasingImg = loadImage(`Assets/HUD/Health/Shield Casing.png`)
}

//Setup
function setup(){
	//Canvas Setup
	new Canvas(windowWidth, windowHeight)
	setupControls()
	displayMode(CENTER)
	noStroke = true
	//General World settings
	allSprites.autoDraw = false
	allSprites.pixelPerfect = true
	world.gravity.y = 10

	//Gameplay setup
	if(gamestate == `main`){
		mainMenuSetup()
	}
	else if(gamestate == `saveFile`){
		saveFileMenuSetup()
	}
	else if(gamestate == `playing`){
		console.log(`LOADING GAMEPLAY`)
		playingSpriteGroup = new Group()
		//Tilemap Setup
		loadTileData()
		//loadNewMap(0)
		SplitMap(0)
		//Camera Setup
		loadCameraData()

		//Player Setup
		loadPlayerModel()
		loadPlayerAnis()
		teleport(player,0,25)
	}
	else if(gamestate == `paused`){
		pauseMenuSetup()
	}
	else if(gamestate == `controls`){
		controlsMenuSetup()
	}
	else if(gamestate == `inventory`){
   		inventoryMenuSetup();
	}
	else if(gamestate == `gameOver`){
		deathMenuSetup();
	}
}

//Draw
function draw(){
	if(gamestate == `playing`){	
		background('white')
		noStroke = true
		camera.on()
		playingSpriteGroup.draw()
		camera.off()
		displayHUD()

	}
	else if(gamestate == `paused`){
		background('white')
		camera.on()
		playingSpriteGroup.draw()
		camera.off()
		pauseMenu.draw()
	}
	else if(gamestate == `inventory`){
		background('black');
		noStroke = true;
		camera.off();
		inventoryMenu.draw();
	}
	else if(gamestate == `gameOver`){
		//Game Over Screen
		deathMenu.draw()
		drawDeathMenuLabels()
	}
	else if(gamestate == `controls`){
		//Control menu
		background('white')
		noStroke = true
		camera.off()
		controlsMenu.draw()
		drawButtonLabels()
	}
	else if(gamestate == `main`){
		mainMenu.draw()
	}
	else if(gamestate == `saveFile`){
		saveFileMenu.draw()
	}
}

//Updates
function update(){
	if (gamestate == `playing`){
		checkGameplayInputs()
		moveCamera()
		updateCameraCorners()
		findCurrentChunks()
		loadCurrentChunks()
		changePlayerAnimation()
		updateLastSafeTile()
		if(bottomSensor.overlapping(damageTile) && !immune){
			loseHealth(1)
			teleport(player, lastSafeTile.x, lastSafeTile.y - (tileSize/2)) //Teleport player to last safe tile
			player.vel.x = 0
			player.vel.y = 0
		}
	}
	else if(gamestate == `paused`){
		//Pause Menu
		camera.on()
		checkPauseMenuInputs()
		menuInputs(pauseMenuNavigationParameters)
		camera.off()
	}
	else if(gamestate == `inventory`){
   		menuInputs(inventoryMenuNavigationParameters);
		if(kb.presses('i')){
			closeInventory()
		}
	}
	else if(gamestate == `gameOver`){
		//Game Over Screen
		menuInputs(deathMenuNavigationParameters)
	}
	else if(gamestate == `controls`){
		//Control menu
		menuInputs(controlsMenuNavigationParameters)
		updateControlButtonsPositions()
	}
	else if(gamestate == `main`){
		//Main menu
		menuInputs(mainMenuNavigationParameters)
	}
	else if(gamestate == `saveFile`){
		menuInputs(saveFileMenuNavigationParameters)
	}
}

////Key Functions
//Player controls
function checkPauseMenuInputs(){
	if(kb.pressed(`ESCAPE`)){
		unpause()
	}
}
function checkGameplayInputs(){
	////Auto Functions

	//Height Locking
	if(heightLocked){
		player.y = lockedHeight
		player.vel.y = 0 //If height locked, set vertical velocity to 0
	}
	//Wall Slide
	if(wallJumpSlideUnlocked && !bottomSensor.overlapping(regularTile) && (leftSensor.overlapping(regularTile) || rightSensor.overlapping(regularTile))){
		if(player.vel.y > 2){
			player.vel.y = 2
		}
	}

	//Ability Recharge
	if(bottomSensor.overlapping(regularTile) || (wallJumpSlideUnlocked && (leftSensor.overlapping(regularTile) || rightSensor.overlapping(regularTile)))){
	  doubleJumpCharged = true //If player on ground or wall, set double jump to charged
	  dashCharged = true //If player on ground or wall, set dash to charged
	}
	//Inputs

	if(kb.pressed(getKeyBinding(`pause`,0)) || kb.pressed(getKeyBinding(`pause`,1))){
		//Open pause menu
		pause()
	}

	if(kb.presses(getKeyBinding(`attack`,0)) || kb.presses(getKeyBinding(`attack`,1))){
		//player Attacks
	}

	if(kb.presses(getKeyBinding(`focus`,0)) || kb.presses(getKeyBinding(`focus`,1))){
		//player focuses/cast
	}

	if(kb.presses(getKeyBinding(`inventory`,0)) || kb.presses(getKeyBinding(`inventory`,1))){
    	openInventory()
	}

	if(kb.presses(getKeyBinding(`Sdash`,0)) || kb.presses(getKeyBinding(`Sdash`,1))){
		//Super Dash
	}


	if(kb.presses(getKeyBinding(`dash`,0)) || kb.presses(getKeyBinding(`dash`,1))){
		if(dashUnlocked && dashCharged && dashCold){//If dash unlocked, charged and not on cooldown
			movementLocked = true
			dashCold = false
			dashCharged = false //Set dash to not charged
			heightLocked = true
			lockedHeight = player.y
			if(player.mirror.x == false){//If player facing right or on right wall
				if(rightSensor.overlapping(regularTile) && wallJumpSlideUnlocked){//If player on left wall and wall jump slide unlocked
					player.mirror.x = true
					player.vel.x = -5
				}
				else{
					player.vel.x = 5
				}
			}
			else if(player.mirror.x == true){//If player facing left or on left wall
				if(leftSensor.overlapping(regularTile) && wallJumpSlideUnlocked){//If player on right wall and wall jump slide unlocked
					player.mirror.x = false
					player.vel.x = 5
				}
				else{
					player.vel.x = -5
				}
			}

			//animationRequestQueue.push([`dash`,1]) //Add dash animation to queue
			setTimeout(dashEnd, dashDuration)
			setTimeout(dashCooldown, dashCooldownTime) //Set dash cooldown to 600 milliseconds
		}
	}
	//Movement
	if (movementLocked == false){
		//Jumping
		if(kb.presses((getKeyBinding(`jump`,0))) || kb.presses(getKeyBinding(`jump`,1))){//Jumping
			//Seperated statement so that double jump can be implemented later 
			if(jumpHacked == true){
				player.vel.y = -6 //Jump velocity
				animationRequestQueue.push([`jump`,1]) //Add jump animation to queue
			}
			else if(bottomSensor.overlapping(regularTile)){
			 	player.vel.y = -6

				animationRequestQueue.push([`jump`,1])
			}
			else if(leftSensor.overlapping(regularTile) && wallJumpSlideUnlocked){//If player on left wall and wall jump slide unlocked
				player.vel.y = -5
				player.vel.x = 4 //Push away from left wall
			}
			else if(rightSensor.overlapping(regularTile) && wallJumpSlideUnlocked){//If player on right wall and wall jump slide unlocked
				player.vel.y = -5
				player.vel.x = -4 //Push away from right wall
			}
			else{
				if(doubleJumpCharged && doubleJumpCold && doubleJumpUnlocked){//If double jump charged and not on cooldown
					player.vel.y = -6 //Jump velocity
					doubleJumpCharged = false //Set double jump to not charged
					doubleJumpCold = false
					setTimeout(doubleJumpCooldown, doubleJumpCooldownTime) //Set double jump cooldown to 30 milliseconds

				}
			}
		}
		//left and right movement
		if((kb.pressing(getKeyBinding(`left`,0)) || kb.pressing(getKeyBinding(`left`,1)) || kb.pressing(getKeyBinding(`right`,0)) || kb.pressing(getKeyBinding(`right`,1)))){//Makes the priority of the left and right movement being pressed equal
			// if both left and right pressed, do nothing
			if((kb.pressing(getKeyBinding(`left`,0)) || kb.pressing(getKeyBinding(`left`,1))) && (kb.pressing(getKeyBinding(`right`,0)) || kb.pressing(getKeyBinding(`right`,1)))){
				// both pressed: intentionally do nothing
			}
			else if(kb.pressing(getKeyBinding(`left`,0)) || kb.pressing(getKeyBinding(`left`,1))){//if keybinding for left pressed, move 
				player.mirror.x = true//mirror player to face left
				if(bottomSensor.overlapping(regularTile)){//If player on ground instantly accelerate
					player.vel.x = -2
				}
				else{//if player in air accelerate normally
					if (player.vel.x > -2){//cap speed at 2
						if(player.vel.x < -2){
							player.vel.x = -2
						}
						player.vel.x -= 0.5
					}
				}
			}
			else if(kb.pressing(getKeyBinding(`right`,0)) || kb.pressing(getKeyBinding(`right`,1))){//if keybinding for right pressed, move right
				player.mirror.x = false//mirror player to face right
				if(bottomSensor.overlapping(regularTile)){//If player on ground instantly accelerate
					player.vel.x = 2
				}
				else{//if player in air accelerate normally
					if (player.vel.x < 2){//cap speed at 2
						if(player.vel.x > 2){
							player.vel.x = 2
						}
						player.vel.x += 0.5
					}
				}
			}
		}
		//Idle deceleration
		else{
			//tend speed to zero, if close enough just approximate to zero
			if (player.vel.x > 0){
				if(player.vel.x < 0.5){
					player.vel.x = 0
				}
				else{
					player.vel.x -= 0.5
				}
			}
			else if (player.vel.x < 0){
				if (player.vel.x > -0.5){
					player.vel.x = 0
				}
				else{
					player.vel.x += 0.5
				}
			}
		}
	}
}

function teleport(target,x,y){
	target.x = x
	target.y = y
}

function dashEnd(){
		if(paused){
		scheduledUnpauseFunctions.push([dashEnd,(world.realTime - pauseStart)])
	}
	// Function was called before game was paused, but game is not paused now
	else if(dashDuration/1000 > (world.realTime - pauseStart)){
		setTimeout(dashEnd, (pauseDuration))
	}
	//Function called normally
	else{
		movementLocked = false,
		heightLocked = false, 
		player.vel.x = 0
	}
}

function dashCooldown(){
	//Function was called While game was paused
	if(paused){
		scheduledUnpauseFunctions.push([dashCooldown,(world.realTime - pauseStart)])
	}
	// Function was called before game was paused, but game is not paused now
	else if(dashCooldownTime/1000 > (world.realTime - pauseStart)){
		setTimeout(dashCooldown, (pauseDuration))
	}
	//Function called normally
	else{
			dashCold = true
	}
}

function doubleJumpCooldown(){
	//Function was called While game was paused
	if(paused){
		scheduledUnpauseFunctions.push([doubleJumpCooldown,(world.realTime - pauseStart)])
	}
	// Function was called before game was paused, but game is not paused now
	else if(doubleJumpCooldownTime/1000 > (world.realTime - pauseStart)){
		setTimeout(doubleJumpCooldown, (pauseDuration))
	}
	//Function called normally
	else{
			doubleJumpCold = true
	}
}


////Generic functions
function findDistance(point1,point2){
	let distanceSquared = (point1.x-point2.x)**2 +(point1.y-point2.y)**2
	let distance = Math.sqrt(distanceSquared)
	return distance
}

function max(array){
	if(array.length > 0){
		array[0] = max 
		for(i = 0; i < array.length; i++){
			if(array[i] > max){
				max = array[i]
			}
		}
	}
	return max
}

function min(array){
	if(array.length > 0){
		array[0] = min 
		for(i = 0; i < array.length; i++){
			if(array[i] < min){
				min = array[i]
			}
		}
	}
	return min
}



