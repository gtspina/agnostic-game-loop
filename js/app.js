"use strict";

var myGame;

window.addEventListener("DOMContentLoaded", function() {
	/*
	var assetsLoader = new AssetsLoader({
		assets: assets,
		game: undefined,
		nextScene: Match3World
	});*/
	
	/*
	myGame = new Game({
		gameScene: SpaceWarsGame,
		printer: new Canvas2dPrinter({
			canvasId: "myCanvas"
		}),
		input: Keyboard,
		width: 800,
		height: 480
	});*/
	
	myGame = new Game({
		//gameScene: SpaceWarsGame,
		gameScene: {
			pos: new Vector2(),
		
			init: function() {},
			update: function() {},
			draw: function(printer) {
				printer.drawRect({
					active: true,
					id: "rect-1",
					pos: new Vector2(this.pos.X++, 10),
					width: 50,
					height: 50,
					color: "red"
				});
			},
		},
		printer: new Canvas2dPrinter({
			printerId: "myCanvas",
			fatherElementId: "app",
			width: 800,
			height: 480
		}),
		input: GamePad,
		width: 800,
		height: 480
	});
	
	//assetsLoader.game = myGame;
	
	myGame.init();
});