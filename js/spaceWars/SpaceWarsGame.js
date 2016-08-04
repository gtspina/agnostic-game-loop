"use strict";

var SpaceWarsGame = {
	input: undefined,
	controller: undefined,
	
	points: 0,
	lifes: 0,
	gameOver: false,
	
	enemys: undefined,
	coins: undefined,
	
	partsBg: undefined,
	firstPartsBg: undefined,
	
	player: undefined
};

SpaceWarsGame.init = function(config) {
	var that = this;
	
	that.width = config.width;
	that.height = config.height;
	
	that.input = config.input;
	that.controller = new SpaceWarsController({
		input: that.input,
		mappedKeys: SpaceWarsController[that.input.id].mappedKeys
	});
	
	that.points = 0;
	that.lifes = 10;
	that.gameOver = false;
	
	that.createGameObjects();
};

SpaceWarsGame.createGameObjects = function() {
	var that = this;
	
	
	that.firstPartsBg = [];
	that.partsBg = SpaceWarsUtil.createPartsBg({
		firstPartsBg: that.firstPartsBg,
		numCollumns: 8,
		numGameObjs: 8,
		pos: new Vector2(0, -100),
		incrementPos: new Vector2(0, 100),
		incrementPosColumn: new Vector2(100, 0),
		colors: ["black", "blue"],
		width: 100,
		height: 100
	});
	
	that.enemys = SpaceWarsUtil.createGameObjects({
		numGameObjs: 10,
		active: false,
		width: 50,
		height: 50,
		color: "red",
		prefixId: "enemys" 
	});
	
	that.coins = SpaceWarsUtil.createGameObjects({
		numGameObjs: 10,
		active: false,
		width: 25,
		height: 25,
		color: "yellow",
		prefixId: "coins"
	});
	
	that.player = new Ship({
		id: "player",
		active: true,
		pos: new Vector2(that.width / 2, that.height * 3/4),
		color: "white",
		width: 50,
		height: 50
	});
};

SpaceWarsGame.reinit = function() {
	var that = this;
	
	that.points = 0;
	that.lifes = 10;
	that.gameOver = false;
	
	that.firstPartsBg = [];
	that.partsBg = SpaceWarsUtil.createPartsBg({
		firstPartsBg: that.firstPartsBg,
		numCollumns: 8,
		numGameObjs: 8,
		pos: new Vector2(0, -100),
		incrementPos: new Vector2(0, 100),
		incrementPosColumn: new Vector2(100, 0),
		colors: ["black", "blue"],
		width: 100,
		height: 100
	});
	
	that.enemys = SpaceWarsUtil.createGameObjects({
		numGameObjs: 10,
		active: false,
		width: 50,
		height: 50,
		color: "red"
	});
	
	that.coins = SpaceWarsUtil.createGameObjects({
		numGameObjs: 10,
		active: false,
		width: 25,
		height: 25,
		color: "yellow"
	});
	
	that.player = new Ship({
		active: true,
		pos: new Vector2(that.width / 2, that.height * 3/4),
		color: "white",
		width: 50,
		height: 50
	});
};

SpaceWarsGame.update = function() {
	var that = this;
	
	if(!that.gameOver) {
		var commands = that.controller.getCommands();
		
		that.player.update({
			commands: commands,
			widthScreen: that.width,
			heightScreen: that.height
		});
		
		SpaceWarsUtil.moveGameObjects({
			pos: new Vector2(0, -5),
			gameObjs: that.player.bullets,
			callback : function() {
				if(this.active) {
					
					if(SpaceWarsUtil.outisideScreen(this, that.width, that.height).outsideMinY) {
						this.active = false;
					}
					
					SpaceWarsUtil.collisionGameObjs({
						gameObj: this,
						gameObjs: that.enemys,
						callback: function(gameObjCollided) {
							this.active = false;
							gameObjCollided.active = false;
							that.points += 10;
						}
					});
					
				}
			}
		});
		
		SpaceWarsUtil.moveGameObjects({
			pos: new Vector2(0, 5),
			gameObjs: that.enemys,
			callback : function() {
				if(SpaceWarsUtil.outisideScreen(this, that.width, that.height).outsideMaxY) {
					this.active = false;
				}
				
				if(this.active) {
					if(SpaceWarsUtil.hasCollision(that.player, this)) {
						this.active = false;
						
						if(that.lifes > 0) {
							that.lifes -= 1;
						}
					}	
				}
			}
		});
		
		SpaceWarsUtil.moveGameObjects({
			pos: new Vector2(0, 5),
			gameObjs: that.coins,
			callback : function() {
				if(SpaceWarsUtil.outisideScreen(this, that.width, that.height).outsideMaxY) {
					this.active = false;
				}
				
				if(this.active) {
					if(SpaceWarsUtil.hasCollision(that.player, this)) {
						this.active = false;
						that.points += 10;
					}	
				}
			}
		});
		
		SpaceWarsUtil.movePartsBg({
			pos: new Vector2(0, 5),
			gameObjs: that.partsBg,
			firstPartsBg: that.firstPartsBg,
			widthScreen: that.width,
			heightScreen: that.height
		});
		
		var rnd = Math.random() * 500;
		var newPos = new Vector2(Math.random() * that.width ,-100);
		
		if(rnd < 10) {
			SpaceWarsUtil.activate(that.enemys, newPos);
		}
		
		rnd = Math.random() * 500;
		newPos = new Vector2(Math.random() * that.width ,-100);
		
		if(rnd < 10) {
			SpaceWarsUtil.activate(that.coins, newPos);
		}
		
		if(that.lifes < 1) {
			that.gameOver = true;
		}
		
	} else {
		var commands = that.controller.getCommands();
		
		if(commands.indexOf(shipCommands.Fire) > -1) {
			SpaceWarsGame.reinit();
		}
	}
	
};

SpaceWarsGame.draw = function(printer) {
	var that = this;

	SpaceWarsUtil.drawPartsBg({
		gameObjs: that.partsBg,
		printer: printer
	});
	
	printer.drawRect({
		id: that.player.id,
		active: that.player.active,
		pos: that.player.pos,
		color: that.player.color,
		width: that.player.width,
		height: that.player.height
	});

	SpaceWarsUtil.drawGameObjects({
		gameObjs: that.player.bullets,
		printer: printer
	});
	
	SpaceWarsUtil.drawGameObjects({
		gameObjs: that.enemys,
		printer: printer
	});
	
	SpaceWarsUtil.drawGameObjects({
		gameObjs: that.coins,
		printer: printer
	});

	printer.drawText({
		id: "pontos",
		content: "Pontos: " + that.points,
		font: "30px Segoe UI",
		pos: new Vector2(10, 50),
		color: "white",
		textBaseLine: TextBaseLine.Top,
	});
	
	printer.drawText({
		id: "vidas",
		content: "Vidas: " + that.lifes,
		font: "30px Segoe UI",
		pos: new Vector2(10, 80),
		color: "white",
		textBaseLine: TextBaseLine.Top,
	});
	
	if(that.gameOver) {
		printer.drawText({
			id: "gameOver",
			content: "GAME OVER",
			font: "30px Segoe UI",
			pos: new Vector2(10, 120),
			color: "white",
			textBaseLine: TextBaseLine.Top,
		});
	}
	
	if(that.gameOver) {
		printer.drawText({
			id: "gameOver2",
			content: "Pressione FOGO para reiniciar",
			font: "30px Segoe UI",
			pos: new Vector2(10, 170),
			color: "white",
			textBaseLine: TextBaseLine.Top,
		});
	}
};