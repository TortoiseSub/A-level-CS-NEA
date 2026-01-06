let player
let playerModel
let knightSpriteSheet

let currentHealth = 8
let maxHealth = 8

let immune = false
let IFrameDuration = 1300 //Duration of invincibility frames in ms

let HUDCasingImg
let shieldImg	
let brokenShieldImg
let shieldCasingImg

let currentItemTag = `_null` // This can be changed to `_sword`, `_cape`, `_sword_cape` or `_null` based on the player's current items

let baseAnimationState = `idle_null` // The current Base animation state

let currentAnimation = `idle_null` //The next animation to be switched to 
let currentAnimationPriority = 0 //The priority of the next animation to be switched to
let currentAnimationIsBaseState = true // if the next animation to be switched to is a base state animation

let activeAnimation = `idle_null` // the currently running animation
let activeAnimationPriority = 0 // the priority of the currently running animation
let activeAnimationIsBaseState = true //If the currently running animation is a base state 

let animationRequestQueue = []
let animationEndQueue = []

function loadPlayerModel(){
	playerModel = new playingSpriteGroup.Group()

    player = new playerModel.Sprite(50,50,18)
	player.addCollider(0,2.5,17)
	player.addCollider(0,-2.5,17)
	player.collider = 'd'
	player.rotationLock = true
	player.friction = 0
	player.bounciness = 0
	player.drag = 0

    //player.debug = true

    bottomSensor = new playerModel.Sprite(player.x, player.y + (22/2), 17 - 4,1)
	bottomSensor.mass = 0.01
	bottomSensor.collider = `n`
	bottomSensor.visible = false
	bottomSensor.rotationLock = true
	bottomSensor.bounciness = 0
	bottomSensor.friction = 0

	leftSensor = new playerModel.Sprite(player.x - (17/2), player.y,1,22 -8 )
	leftSensor.mass = 0.01
	leftSensor.collider = `n`
	leftSensor.visible = false
	leftSensor.rotationLock = true
	leftSensor.bounciness = 0
	leftSensor.friction = 0


	rightSensor = new playerModel.Sprite(player.x + (17/2), player.y, 1,22 - 8 )
	rightSensor.mass = 0.01
	rightSensor.collider = `n`
	rightSensor.visible = false
	rightSensor.rotationLock = true
	rightSensor.bounciness = 0
	rightSensor.friction = 0

	topSensor = new playerModel.Sprite(player.x, player.y - (22/2), 17 - 4,1)
	topSensor.mass = 0.01
	topSensor.collider = `n`
	topSensor.visible = false
	topSensor.rotationLock = true
	topSensor.bounciness = 0
	topSensor.friction = 0

    let jbottom = new GlueJoint(player,bottomSensor)
	jbottom.visible = false
	let jLeft = new GlueJoint(player,leftSensor)
	jLeft.visible = false
	let jRight = new GlueJoint(player,rightSensor)
	jRight.visible = false
	let jTop = new GlueJoint(player,topSensor)
	jTop.visible = false
}

function loadPlayerAnis(){
	player.spriteSheet = knightSpriteSheet
	player.addAnis({
		run_null : {row : 0, frames : 8, frameSize: [544, 705]},
		run_sword : {row : 1, frames : 8, frameSize: [544, 705]},
		run_cape : {row : 2, frames : 8, frameSize: [544, 705]},
		run_sword_cape : {row : 3, frames : 8, frameSize: [544, 705]},
		idle_null : {row : 4, frames : 8, frameSize : [544,705]},
		idle_sword : {row : 5, frames : 8, frameSize: [544, 705]},
		idle_cape : {row : 6, frames : 8, frameSize: [544, 705]},
		idle_sword_cape : {row : 7, frames : 8, frameSize: [544, 705]},
		wallSlide_null : {row : 8, frames : 8, frameSize: [544,705]},
		wallSlide_sword : {row : 9, frames : 8, frameSize: [544,705]},
		wallSlide_cape : {row : 10, frames : 8, frameSize: [544,705]},
		wallSlide_sword_cape : {row : 11, frames : 8, frameSize: [544,705]},
		jump_null : {row : 12, frames : 8, frameSize: [544, 705]},
		jump_sword : {row : 13, frames : 8, frameSize: [544, 705]},
		jump_cape : {row : 14, frames : 8, frameSize: [544, 705]},
		jump_sword_cape : {row : 15, frames : 8, frameSize: [544, 705]},
		fall_null : {row : 16, frames : 8, frameSize: [544, 705]},
		fall_sword : {row : 17, frames : 8, frameSize: [544, 705]},
		fall_cape : {row : 18, frames : 8, frameSize: [544, 705]},
		fall_sword_cape : {row : 19, frames : 8, frameSize: [544, 705]},
	})
}



function changeBaseAnimationState(){
	//Updates the base animation state based on the player's current state
	if(bottomSensor.overlapping(walkable)){
		if(player.vel.x == 0){
			baseAnimationState = `idle`+currentItemTag
		}
		else{
			baseAnimationState = `run`+currentItemTag
		}
	}
	else{
		if(leftSensor.overlapping(walkable)||rightSensor.overlapping(walkable)){
			baseAnimationState = `wallSlide`+currentItemTag
		}
		else{
			baseAnimationState = `fall`+currentItemTag
		}
	}
}
function findCurrentAnimation(){
	//Cycle incoming requests and choose the highest priority 
	currentAnimationPriority = 0

	if(animationRequestQueue.length > 0){
		for(let i = 0; i < animationRequestQueue.length; i++){
		if(animationRequestQueue[i][1] > currentAnimationPriority){
			currentAnimation = animationRequestQueue[i][0]+currentItemTag
			currentAnimationPriority = animationRequestQueue[i][1]
			currentAnimationIsBaseState = false
		}
	}
	}
	//If no requests set currentAnimation to baseState
	else{
		currentAnimation = baseAnimationState
		currentAnimationPriority = 0
		currentAnimationIsBaseState = true
	}
	//Reset animation request queue
	animationRequestQueue = []
}

function changePlayerAni(){
	//if the currentAnimation is a base state
	if (currentAnimationIsBaseState){
		//and the active animation is a base state
		if(activeAnimationIsBaseState){
			if(currentAnimation != activeAnimation){
				//switch the animations
				player.changeAni(currentAnimation)
				activeAnimation = currentAnimation
				activeAnimationPriority = 0
				activeAnimationIsBaseState = true
			}

		}
	}
	//if the current animation is not a base state 
	else{
	
		//if the current animation has a higher priority than the active animation, switch
		if(currentAnimationPriority > activeAnimationPriority){
			player.changeAni(currentAnimation)
			activeAnimation = currentAnimation
			activeAnimationIsBaseState = false
			activeAnimationPriority = currentAnimationPriority
			player.ani.scale = 0.065
			player.ani.frameDelay = 6
			animationEndQueue.push(activeAnimation)
			setTimeout(resetAnimation,(400)) 
		}
	}
}

function resetAnimation(){
	if(activeAnimation == animationEndQueue[0]){
		currentAnimation = baseAnimationState
		currentAnimationIsBaseState = true
		currentAnimationPriority = 0
		player.changeAni(currentAnimation)
		activeAnimation = currentAnimation
		activeAnimationIsBaseState = true
		activeAnimationPriority = 0
	}
	animationEndQueue.splice(0,1)
}
function changePlayerAnimation(){
	changeBaseAnimationState()
	findCurrentAnimation()
	changePlayerAni()
	player.ani.scale = 0.065
	player.ani.frameDelay = 4
}

function displayHUD(){
	camera.off()
	image(HUDCasingImg, 25, 5, 256, 128)
	for(let i = 0; i < maxHealth; i++){
		if(i < currentHealth){
			image(shieldImg, 100 + (i * 60), 9, 80, 80)
		}
		else{
			image(shieldCasingImg, 100 + (i * 60), 9, 80, 80)
			image(brokenShieldImg, 100 + (i * 60), 9, 80, 80)
		}
	}
	camera.on()
}

function loseHealth(quantity){
	if(currentHealth > 0 && !immune){
		currentHealth -= quantity
		immune = true 
		setTimeout(immunityTimeout, IFrameDuration)
	}
	if(currentHealth <= 0){
		if (fileType == `steelsoul`){
			fileType = `steelsoulbroken`
			clearInterval(autoSave)
			saveData(saveFile)
            allSprites.remove()
            openMainMenu()
		}
		if(fileType == `normal`){
			gameState = `gameOver`
			openDeathMenu()
		}
	}
}

function heal(quantity){
	if(quantity == `Max`){
		currentHealth = maxHealth
	}
	else if(currentHealth < maxHealth){
		currentHealth += quantity
		if(currentHealth > maxHealth){
			currentHealth = maxHealth
		}

	}
}

function immunityTimeout(){
	if(paused){
		scheduledUnpauseFunctions.push([immunityTimeout,(world.realTime - pauseStart)])
	}
	else if(IFrameDuration/1000 > (world.realTime - pauseStart)){			
		setTimeout(immunityTimeout, (pauseDuration))		
	}
	else{
		immune = false
	}
}

function setupControls(){
	controls = [
		[`left`,[`arrowLeft`,``]],
		[`right`,[`arrowRight`,``]],
		[`jump`,[`z`,``]],
		//[`attack`,[`x`,``]],
		[`dash`,[`c`,``]],
		[`pause`,[`ESCAPE`,``]],
		[`inventory`,[`i`,``]],
		[`interact`,[`arrowUp`,``]],
		//[`QuickMap`,[`TAB`,``]],
		//[`lookUp`,[`UPARROW`,``]],
		//[`lookDown`,[`DOWNARROW`,``]],
		//[`focus`,[`a`,``]],
		//controls[i][1][index]
	]
}
function getKeyBinding(action, index){
	for(let i = 0; i < controls.length; i++){
		if(controls[i][0] == action){
			return controls[i][1][index]
		}
	}
}
