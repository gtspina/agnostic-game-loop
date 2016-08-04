"use strict";

var SpaceWarsUtil = {};

SpaceWarsUtil.createPartsBg = function(config) {
	var collumn = [];
	var incrementPosColumn = config.incrementPosColumn;
	
	for(var i=0;i<config.numCollumns;i++) {	
		config.currCollumnIndex = i;
		
		var currCollumn = SpaceWarsUtil.createColumnPartsBg(config);
		
		config.pos.X += incrementPosColumn.X;
		config.pos.Y += incrementPosColumn.Y;
		config.colors.reverse(); 	
		
		collumn.push(currCollumn);
		config.firstPartsBg.push(currCollumn[0]);
	}
	
	return collumn;
}

SpaceWarsUtil.createColumnPartsBg = function(config) {
	var gameObjs = [];
	var colors = config.colors;
	var currColorIndex = 0;
	var initialPos = new Vector2(config.pos.X, config.pos.Y);
	var incrementPos = config.incrementPos;
	
	for(var i=0;i<config.numGameObjs;i++) {
		var currGameObj = new GameObject({
			id: "row-"+i+"-"+"-col-"+config.currCollumnIndex,
			pos: new Vector2(initialPos.X, initialPos.Y),
			active: true,
			width: config.width,
			height: config.height,
			color: colors[currColorIndex]
		});
		currColorIndex = (currColorIndex + 1) % colors.length;
        
		initialPos.X += incrementPos.X;
		initialPos.Y += incrementPos.Y;
		
		gameObjs.push(currGameObj);
	}
	
	return gameObjs;
};

SpaceWarsUtil.createGameObjects = function(config) {
	var gameObjs = [];
	
	for(var i=0;i<config.numGameObjs;i++) {
		var currGameObj = new GameObject({
			id: config.prefixId + "-" + i,
			pos: new Vector2(0, 0),
			active: config.active,
			width: config.width,
			height: config.height,
			color: config.color
		});
		
		gameObjs.push(currGameObj);
	}
	
	return gameObjs;
};

SpaceWarsUtil.activate = function(gameObjs, newPos) {
	
	for(var i=0;i<gameObjs.length;i++) {
		var gameObj = gameObjs[i];
		
		if(!gameObj.active) {
			gameObj.pos = newPos;
			gameObj.active = true;
			break;
		}
	}
	
};

SpaceWarsUtil.moveGameObjects = function(config) {
	
	for(var i=0;i<config.gameObjs.length;i++) {
		var currGameObj = config.gameObjs[i];
		
		if(currGameObj.active) {
			currGameObj.pos.X += config.pos.X;
			currGameObj.pos.Y += config.pos.Y;
			
			if(config.callback) {
				config.callback.call(currGameObj);
			}
		}
	}
	
};

SpaceWarsUtil.movePartsBg = function(config) {

	for(var i=0;i < config.gameObjs.length;i++) {
		var currCollumn = config.gameObjs[i];
		
		SpaceWarsUtil.moveGameObjects({
			pos: new Vector2(config.pos.X, config.pos.Y),
			gameObjs: currCollumn,
			callback: function() {
				if(SpaceWarsUtil.outisideScreen(this, config.widthScreen, config.heightScreen).outsideMaxY) {
					var lastOutside = config.firstPartsBg[i];
					var newPos = new Vector2(lastOutside.pos.X, lastOutside.pos.Y - lastOutside.height);
					
					this.pos.Y = lastOutside.pos.Y - lastOutside.height;
					
					if(i < config.gameObjs.length) {
						this.pos.Y += config.pos.Y;
						
					}
					
					config.firstPartsBg[i] = this;
				}
			}
		});
	}

};


SpaceWarsUtil.drawGameObjects = function(config) {
	
	for(var i=0;i<config.gameObjs.length;i++) {
		var currGameObj = config.gameObjs[i];
		
		//if(currGameObj.active) {
			config.printer.drawRect({
				id: currGameObj.id,
				active: currGameObj.active,
				color: currGameObj.color,
				width: currGameObj.width,
				height: currGameObj.height,
				pos: currGameObj.pos
			});
	//}
	}
	
};

SpaceWarsUtil.drawPartsBg = function(config) {
	
	for(var i=0;i < config.gameObjs.length;i++) {
		var currCollumn = config.gameObjs[i];
		
		SpaceWarsUtil.drawGameObjects({
			gameObjs: currCollumn,
			printer: config.printer
		});
	}
	
};


SpaceWarsUtil.hasCollision = function(obj1, obj2) {
	var maxX = obj1.pos.X + obj1.width > obj2.pos.X;
	var maxY  = obj1.pos.Y + obj1.height > obj2.pos.Y;
	var minX = obj1.pos.X < obj2.pos.X + obj2.width;
	var minY  = obj1.pos.Y < obj2.pos.Y + obj2.height;

	return maxX && minX && maxY && minY;
	
};

SpaceWarsUtil.collisionGameObjs = function(config) {

	for(var i=0;i<config.gameObjs.length;i++) {
		var currGameObj = config.gameObjs[i];
		
		if(SpaceWarsUtil.hasCollision(config.gameObj, currGameObj)) {
			if(currGameObj.active) {
				if(config.callback) {
					config.callback.call(config.gameObj, currGameObj);
				}	
			}
		}
	}

};

SpaceWarsUtil.outisideScreen = function(obj, widthScreen, heightScreen) {
	var outsideMinY = obj.pos.Y + obj.height < 0;
	var outsideMaxY = obj.pos.Y - obj.height > heightScreen;
	
	
	return {
		outsideMinY: outsideMinY,
		outsideMaxY: outsideMaxY
	};
};