let cameraZoom = 3
let camSprite

let camCorners = []


function loadCameraData(){
    camSprite = new playingSpriteGroup.Sprite(0,0,2)
	camSprite.collider = `n`
	camSprite.rotationLock = true
	camSprite.friction = 0
	camSprite.bounciness = 0
    camSprite.visible = false

	camera.zoom = cameraZoom
}
function updateCameraCorners(){
	camCorners = [
		[(camSprite.x - (width/(2*cameraZoom))),(camSprite.y - (height/(2*cameraZoom)))], //Top Left
		[(camSprite.x + (width/(2*cameraZoom))),(camSprite.y - (height/(2*cameraZoom)))], //Top Right
		[(camSprite.x - (width/(2*cameraZoom))),(camSprite.y + (height/(2*cameraZoom)))], //Bottom Left
		[(camSprite.x + (width/(2*cameraZoom))),(camSprite.y + (height/(2*cameraZoom)))], //Bottom Right
	]
}

function moveCamera(){
	let d = findDistance(camSprite, player)
	if(d > 5000){ 
		camSprite.x = player.x //Teleports the camera to the player if there has been a case where the camera is unable to follow the player
		camSprite.y = player.y
	}
	else if(d > 10){
		s = 1.1**(d/2)
	}
	else{
		s = 0 // Prevents the camera from jittering when close to the player
	}
	camSprite.speed = s
	camSprite.moveTo(player)

	camera.x = camSprite.x
	camera.y = camSprite.y
}