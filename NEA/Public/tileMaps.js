let tilemap
let tileSize = 20
let tilesGroup

let chunks = []
let currentChunks = []
let chunkSize = 16
let loadedChunks = []
let chunkKeys = new Map()


let walkable
let ground


function loadNewMap(mapNum) {
    if(tilemap)	{tilemap.removeAll()}
   
	tilemap = new Tiles(
		tileMapsData[mapNum][0],
		tileMapsData[mapNum][1],
		tileMapsData[mapNum][2],
		tileSize,
		tileSize
	)

}

function loadTileData() {
	let tilesGroup = new playingSpriteGroup.Group()

	walkable = new tilesGroup.Group()
	walkable.friction = 0
	walkable.bounciness = 0
    //allSprites.debug = true

	ground = new walkable.Group()
	ground.physics = `KIN`
	ground.w = tileSize
	ground.h = tileSize
	ground.colour = 'blue'

	regularTile = new ground.Group()
	regularTile.colour = 'blue'
	regularTile.tile = `b`

	damageTile = new ground.Group()
	damageTile.colour ='red'
	damageTile.tile = `c`
}
let tileMapsData = [
	[[
		"b.b.bb........................................................................................................................bb",
		"..b...bb..b.b.................................................................................................................bb",
		"..........b.bb.bbb.bb.........................................................................................................bb",
		"...b..b...b..b.......bb................................................................bbb....................................bb",
		"b.b..b.bb.b.b.....b.........b....................bbbbbbbbbbbbbbbbb.........bbb...bbbbbbbbbb...................................bb",
		"b.b..b......b..b.....bb....bb.................bbbbbbbbbbbbbbbbbbbbbbbb...bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..................bb",
		"...........b.......b...b...bb.............bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb........bb",
		"bbb.bbb.b..b....bbb........bb...........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb......bb",
		"...b.........bb...........bbb...........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.....bb",
		".b...b.b..b....b..b..b....bb..............bbbbbbbbbbbbbbbbbbbbbbbbbbbb.................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb....bb",
		".....b.b..bb..b...........bb.................................bbbbbb........................bbbbbbbbbbbbb.....bbbbbbbbbbbbb....bb",
		"...b.....b......b.bb.....bbb....................................................................................bbbbbbbbbbb..bbb",
		"b...bb....b.....b........bb..........................................................................................bbbbbb..bbb",
		"...b..bb.b...b....b.....bbb..................................................................................................bbb",
		"..b.b.b.......b.........bb..............................................bbb......bbbbbbbbbbbbbbbbbbbb........................bbb",
		".bb..b..................bb...................bbb................bbbb.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..............bbb",
		".b......b..bb...........bb....................bb.............bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..........bbb",
		".b.b.b.................bb.....................bb..........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb......bbbb",
		".bb......bb............bb.....................bb..........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb............bbbbbbbbbbbbbbbbbbbbbb..bbbb",
		"...b..b...............bb.......bb..............b.........bbbbbbbbbbbbbbb..................................bbbbbbbbbbbbbbbbbbbbbb",
		".....................bbb......bbbb......................bbbbb......b...........................................bbbbbbbbbbbbbbbbb",
		".....................bb.......bbbb...................bbbbbbb................................................................bbbb",
		"....................bbb........bbb.................bbbbbbbb.................................................................bbbb",
		"....................bb..........b.................bbbbbbb...................................................................bbbb",
		"...................bbb............................bbbb.....................................................................bbbbb",
		"...................bb.............................b........................................................................bbbbb",
		"..bbb..............bb......................................................................................................bbbbb",
		"..bbbb.............b...............................................................................................bb......bbbbb",
		".bbbbb...........bbb..........................................................................................bb.bbbbbbbbbbbbbbb",
		".bbb.............bbb..................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"..................bb..............................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"...........................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.bbbbbbb",
		"...................................................bb...bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...........bbbbb",
		"...................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb....bbbbbbbbbbbbbbbbbbb................bb",
		"....................................................bbbbbbbbbbbbbbbbbbbbbb......................................................",
		"....................................................bbbbbbbbbbbbbbbb............................................................",
		"bbbbbbcccccccbbbbbbbbbbbbbbbb........................bbbbbbbbbbbbb..............................................................",
		"bbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbb.....................bbbbbbbbbbb................................................................",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..........................................................................................bbb...",
		"bbbbbbbbbbbbbbb........bbbbbbbbb..........................................................................................bbbb..",
		"bbbbbbbbb.................bbbbbb..........................................................................................bbbbbb",
		"bbbb.........................bbb..........................................................................................bbbbbb",
		"bbbb...........................b........................bbb.............................bbbb.................................bbb",
		"bbb....................................................bbbbbb...........................bbbbb.................................bb",
		"bbb....................................................bbbbbbb...........................bbbb.................................bb",
		"bbb.....................................................bbbbbb...........................................bbbbbbb..............bb",
		"bbb.........................................................bb........................................bbbbbbbbbbb.............bb",
		"bbb.....................................bbbb..........................................................bbbbbbbbbbb..............b",
		"bbb.....................................bbbbb..................................................................bb..............b",
		"bbb.....................................bbbbbb...................................bbb...........................................b",
		"bbb..........bbbb.......................bbbbbb...................................bbbbbb........................................b",
		"bbb..........bbbb........................bbbbb.......................................bb........................................b",
		"bbb...........bbb.........................bbb..................................................................................b",
		"bbb............................................................................................................................b",
		"bbb..............................................bbbb..........................................................................b",
		"bbb..............................................bbbb.................bbbbbbbbbbbbbbbbbbbbbbbbb................................b",
		"bbb..............................................bbbb.............bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.............................b",
		"bbb............cccc..............................bbbb.........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb....bbbbbb...........bb",
		"bbb........bbbbccccccbbbbbbbbbb...................bbb........bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...........bb",
		"bbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbb.............bbb......bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...........bb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..............bb.....bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb............bb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb......................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb...............bb",
		"bbbbbbbbbbbbbbbbbbbb..bbbbbbbbbbbbbb......................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.....................b",
		"bbbbbbbbbbbbbbbbbbb..........bb...........................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb........................bb",
		"bbbbbbbbbbbbbbbbb.........................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.............................bb",
		"bbbbbbbbbbbbbbb...........................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbb........................................b",
		"bbbbbbbbbbbb..............................................bbbbbbbbbbbbbbbbbbbb.................................................b",
		"bbbbbbbbbbb..............................bbb..............bbbbbb...............................................................b",
		"bbbbbbbbb................................bbb...................................................................................b",
		"bbbbbbb..................................bbb...................................................................................b",
		"bbbb...........................................................................................................................b",
		"bbbb...........................................................................................................................b",
		"bbbb...........................................................................................................................b",
		"bbbb...........................................................................................................................b",
		"bbbb.........................................................................................................bbbbbbbbbbbbbb....b",
		"bbbb.............bbbbbbbb.....................................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbb.............bbbbbbbb.....................................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbb...........................................................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbb...........................................................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbb.......................................................bbbbbbbbbbbb..............bb........bbbbb..........................bbb",
		"bbb..............................................bbbbbbbbbbbbbbbbbbbbb..............bbb.......bbbbb..........................bbb",
		"bbb..............................................bbbbbbbbbbbbbbbbbbbbb.............bbbb.......bbbbb..........................bbb",
		"bbb..........................bbb.................bbbbbbbbbbbbbbb...................bbbb.......bbbbb..........................bbb",
		"bbb..........................bbbb................bbbbbbbbb.........................bbbb.......bbbbb................bbbbbbbbbbbbb",
		"bbb..........................bbbb..................................................bb.........bbbbb................bbbbbbbbbbbbb",
		"bbb...........................bb..............................................................bbbbb..........................bbb",
		"bbb...........................................................................................bbbbb..........................bbb",
		"bbb...........................................................................................bbbbb..........................bbb",
		"bbb.................bbb.................................................bbb...................bbbbb..........................bbb",
		"bbb.................bbbb................................................bbb...................bbbbb.......bbb................bbb",
		"bbb.................bbbb................................................bbb...................bbbbb.......bbb................bbb",
		"bbb.................bbbb................................................bbb...................bbbbb.......bbb................bbb",
		"bbb.................bbb.................................................bbb..................................................bbb",
		"bbb...................................................................bbbbb..................................................bbb",
		"bb...................................................ccc..........bbbbbbbbb..................................................bbb",
		"bb.........bbb...............................bbbbbbbbccccbbbbbbbbbbbbbbbbbb..................................................bbb",
		"bb........bbbb...............................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..................................................bbb",
		"bb........bbb................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bb........bbb................................bbbbbbbbbbbbbbbbbbbbbbb..............bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bb.........bb.....................................................................bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bb.........bb.....................................................................bbbb..........................................",
		"bb.........bb.....................................................................bbbb..........................................",
		"bb................................................................................bbbb..........................................",
		"bb................................................................................bbbb..........................................",
		"bb................bbbbb...........................................................bbbb..........................................",
		"bb................bbbbb..............................................bbbb.........bbbb..........................................",
		"bb................bbbbb..............................................bbbb.........bbbb..........................................",
		"bbbbbbbbbbbbbb....bbb......................bbbbbbb...................bbbb.........bbbb..........................................",
		"bbbbbbbbbbbbbb....bbb......................bbbbbbb................................bbbb..........................................",
		"..................bbb...................bbbbbbbbbb................................bbbb..........................................",
		"..................bbb...................bbbbbbb...................................bbbb..........................................",
		"..................bbb...........................................................................................................",
		"..................bbb...........................................................................................................",
		"..................bbb..............................................................................................bbbb.........",
		"..................bbb..................................bbb.........................................................bbbb.........",
		"....bbb...........bbb..................................bbbbb....................................................................",
		"....bbb...........bbb...................................bbbb....................................................................",
		"....bbb...........bbb...........................................................................................................",
		"..................bbb.......................................................................................bbb.................",
		"..................bbb...............cccccc...................................ccccccc........................bbb.................",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
		"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
	],0,0],
	//[[TileMap],xPosition,YPosition],
]
function SplitMap(mapnumber){
	let mapLength = tileMapsData[mapnumber][0][0].length
	let mapDepth = tileMapsData[mapnumber][0].length
	let chunkSize = 16
	let numChunks = (mapLength/chunkSize)*(mapDepth/chunkSize)
	for(let i = 0; i < mapLength/chunkSize; i++){
		for(let j = 0; j < mapDepth/chunkSize; j++){
			let chunk = []
			let chunkTiles = []
			for(let k = 0; k < chunkSize; k++){
				let line = ""
				for(let l = j*chunkSize; l < (j*chunkSize)+chunkSize; l++){
					line = line + (tileMapsData[mapnumber][0][k+i*chunkSize][l])
				}
				chunkTiles.push(line)
			}
			chunk.push(chunkTiles)
			chunk.push(j*chunkSize*tileSize,i*chunkSize*tileSize)
			chunks.push(chunk)
		}
	}
}
function findCurrentChunks(){
	currentChunks = []
	for(let i = 0; i < chunks.length; i++){
		let chunkL = chunks[i][1] - (tileSize/2)                 // left edge
		let chunkR = chunks[i][1] + (chunkSize * tileSize)           // right edge
		let chunkB = chunks[i][2] - (tileSize / 2) + (chunkSize * tileSize)               // bottom edge
		let chunkT = chunks[i][2] - (tileSize / 2)     // top edge

		let camL = camCorners[0][0]
		let camR = camCorners[3][0]
		let camT = camCorners[0][1]
		let camB = camCorners[3][1]

		if ((camL <= chunkR && camR >= chunkL) &&
		(camT <= chunkB && camB >= chunkT)) {		
			if (!currentChunks.includes(chunks[i])) {
				currentChunks.push(chunks[i]);
			}
		}
	}
}
function loadCurrentChunks(){
	for(let i = 0; i < currentChunks.length; i++){
		//Check if any item of currentChunks is not in loadedChunks
		if(!loadedChunks.includes(currentChunks[i])){
			tilemap = new Tiles(
				currentChunks[i][0],
				currentChunks[i][1],
				currentChunks[i][2],
				tileSize,
				tileSize
			)
			//add keys of fresh chunk keys
			let sprites = [];
			let key = `${currentChunks[i][1]},${currentChunks[i][2]}`
			tilemap.forEach(s => sprites.push(s))
			chunkKeys.set(key, sprites);

			//add fresh chunks to loaded chunks
			loadedChunks.push(currentChunks[i])
		}
	}
	for(let i = 0; i < loadedChunks.length; i++){
		//check if any loaded chunks are not in current chunks
		if(!currentChunks.includes(loadedChunks[i])){
			//remove all noncurrent loaded chunks
			let key = `${loadedChunks[i][1]},${loadedChunks[i][2]}`
			let sprites = chunkKeys.get(key)
			for (let sprite of sprites) {
				sprite.remove();
			}
			//remove keys of removed chunk keys
			chunkKeys.delete(key);
			//remove removed chunks from loaded chunks
			loadedChunks.splice(i,1)
			i--
		}
	}
}

function updateLastSafeTile(){
	bottomSensor.overlapping(regularTile, (b, sprite) =>{
		lastSafeTile = sprite
	})
}