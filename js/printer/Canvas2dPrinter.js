"use strict";

window.requestAnimationFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function (callback) {
	window.setTimeout(callback, 1000/60);
};

var TextBaseLine = {Top: "top"};					

function Canvas2dPrinter(config) {
	this.fatherElement = document.getElementById(config.fatherElementId);
	
	var canvas = document.createElement("canvas");
	canvas.width = config.width;
	canvas.height = config.height;
	canvas.id = config.printerId;
	
	this.fatherElement.appendChild(canvas);
	
	this.canvasDOMElement =  document.getElementById(config.printerId);
	this.canvasContext =  this.canvasDOMElement.getContext("2d");
	this.width =  this.canvasDOMElement.width;
	this.height = this.canvasDOMElement.height;	
}

Canvas2dPrinter.prototype.clear = function() {
	var that = this;
	
	that.canvasContext.clearRect(0, 0, that.width, that.height);
};

Canvas2dPrinter.prototype.drawRect = function(config) {
	var that = this;
	
	if(config.active)
	{
		that.canvasContext.fillStyle = config.color;
		that.canvasContext.fillRect(config.pos.X, config.pos.Y, config.width, config.height);
	}
};

Canvas2dPrinter.prototype.drawImage = function(config) {	
	var that = this;
	
	config.width = (config.width === undefined) ? config.image.width : config.width;
    config.height = (config.height === undefined) ? config.image.height : config.height;
    
	config.image.width = config.width;
	config.image.height = config.height;
	
    that.canvasContext.save();
	that.canvasContext.translate(config.pos.X, config.pos.Y);
	that.canvasContext.rotate(config.rotation);
	that.canvasContext.drawImage(config.image, 0, 0, config.width, config.height, -config.origin.X, -config.origin.Y, config.width, config.height);
    that.canvasContext.restore();
};

Canvas2dPrinter.prototype.drawText = function(config) {
	var that = this;
	
	config.rotation = (config.rotation === undefined) ? 0 : config.rotation;
	
	that.canvasContext.fillStyle = config.color;
	that.canvasContext.font = config.font;
	that.canvasContext.textBaseLine = config.textBaseLine;
	
	that.canvasContext.save();
	that.canvasContext.translate(config.pos.X, config.pos.Y);
	that.canvasContext.rotate(config.rotation);
	that.canvasContext.fillText(config.content, 0, 0);
    that.canvasContext.restore();
};