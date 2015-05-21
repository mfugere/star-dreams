function Preload () {
	this.ready = false;
	this.asset = null;
}

Preload.prototype = {
	preload: function () {
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		this.game.stage.backgroundColor = '#99C0FF';
	    this.load.image('bg1-0', 'img/bg1-0.png');
	    this.load.tilemap('level-1', 'img/tilemap-1.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('tilesheet-1', 'img/tilesheet-1.png');
	    this.load.image('player', 'img/player.png');
	},
	create: function () {
		cursors = game.input.keyboard.createCursorKeys();
		buttons = {
		    jump: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};
	},
	update: function () {
		if (this.ready) {
			this.game.state.start("level1");
		}
	},
	onLoadComplete: function () {
		this.ready = true;
	}
};