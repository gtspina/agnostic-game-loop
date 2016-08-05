"use strict";

function AssetsLoader(config) {
	this.assets = config.assets;
	this.game = config.game;
	this.nextScene = config.nextScene;
	this.assetsLoading = 0;
	this.percentage = 0;
	this.percentageByAssetLoaded = 100 / config.assets.length;
}

AssetsLoader.prototype.init = function() {
	var that = this;
	
	console.log("Carregando...");
	
	that.assets.forEach(function(asset) {
        
        that.assetsLoading += 1;
        
        switch(asset.type)
        {
            case Image:
                that.nextScene.assets.img[asset.name] = new Image();
                that.nextScene.assets.img[asset.name].src = baseFolder.img + asset.localName;
                that.nextScene.assets.img[asset.name].onload = function() {
					that.percentage += that.percentageByAssetLoaded;
					console.log("Asset", asset.name, "pronto!", that.percentage + "%");
					that.assetsLoading -= 1;
				};
            break;                
        }
        
    });
   
};

AssetsLoader.prototype.update = function() {
	var that = this;
	
    if(that.assetsLoading < 1) {
		that.nextScene.init();
		that.game.gameScene = that.nextScene;
	}
};

AssetsLoader.prototype.draw = function(canvas) {
	canvas.drawRect({
		color: "green",
		pos: new Vector2(0, 0),
		width: 50,
		height: 50
	});
};