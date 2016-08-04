"use strict";

function GameObject(config) {
	this.id = config.id,
	this.active = config.active;
	this.pos = config.pos;
	this.color = config.color;
	this.width = config.width;
	this.height = config.height;
}