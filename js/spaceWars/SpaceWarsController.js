"use strict";

/*
function createInput (inputName, mappedKeys) {
	
}

createInput("gamepad", {})
*/

SpaceWarsController.gamePad = {};
SpaceWarsController.mouse = {};
SpaceWarsController.keyboard = {};

SpaceWarsController.gamePad.mappedKeys = {
	"aClicked": shipCommands.Fire,
	"leftPressed": shipCommands.Left,
	"rightPressed": shipCommands.Right
};

SpaceWarsController.mouse.mappedKeys = {
	"middleClick": shipCommands.Fire,
	"leftDown": shipCommands.Left,
	"rightDown": shipCommands.Right
};

SpaceWarsController.keyboard.mappedKeys = {
	"spaceClicked": shipCommands.Fire,
	"leftPressed": shipCommands.Left,
	"rightPressed": shipCommands.Right
};

function SpaceWarsController(config) {
	this.input = config.input;
	this.mappedKeys = config.mappedKeys;
}

SpaceWarsController.prototype.getCommands = function() {
	var that = this;
	var commands = [];
	
	for(var index in that.mappedKeys) {
		var keyValue = that.mappedKeys[index];
	
		if(that.mappedKeys.hasOwnProperty(index)) {
			if(that.input[index]) {
				commands.push(keyValue);
			}
		}
	}
	
	return commands;
};