"use strict";

var shipCommands = {Left: 0 , Right: 1, Fire: 2};

function Ship(config) {
	GameObject.call(this, config);
	this.bullets = SpaceWarsUtil.createGameObjects({
		numGameObjs: 10,
		active: false,
		width: 20,
		height: 20,
		color: "green",
		prefixId: "bullets"
	});;
}

Ship.prototype.update = function(config) {
	var that = this;
	
	if(config.commands.indexOf(shipCommands.Left) > -1) {
		if(that.pos.X > 0) {
			that.pos.X -= 10;
		}
	} else if(config.commands.indexOf(shipCommands.Right) > -1) {
		if(that.pos.X + that.width < config.widthScreen) {
			that.pos.X += 10;
		}
	}
	
	if(config.commands.indexOf(shipCommands.Fire) > -1) {
		var newPos = new Vector2(that.pos.X, that.pos.Y);
		
		SpaceWarsUtil.activate(that.bullets, newPos);
	}
};