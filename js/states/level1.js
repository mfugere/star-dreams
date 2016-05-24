function Level1() {
	this.bgs = [];
	this.spawnRate = 200;
	this.spawnTimer = this.spawnRate;
}

Level1.prototype = {
	preload: function () {
	    this.load.spritesheet('balloon', 'img/balloon.png', 32, 64);
	    this.load.image('bird', 'img/bird.png');
	    this.load.image('buzzard', 'img/buzzard.png');
	    this.load.image('bee', 'img/bee.png');
	    this.load.image('wasp', 'img/wasp.png');
	},
	create: function () {
	    this.bgs.push(this.game.add.tileSprite(0, 0, this.game.world.width, 512, "bg1-0"));
	    this.map = this.game.add.tilemap("level-1");
	    this.map.addTilesetImage("tilesheet-1");
	    this.map.setCollisionBetween(0, 20);
	    this.layer = this.map.createLayer("Tile Layer 1");
	    this.layer.resizeWorld();

	    this.game.physics.startSystem(Phaser.Physics.ARCADE);

	    this.player = new Player({ x: 64, y: game.world.height - 96 }, 'player', []);
	    this.player.init();

	    this.enemies = [];
	    this.birds = this.game.add.group(game.world, "birds", false, true, Phaser.Physics.ARCADE);
	    this.buzzards = this.game.add.group(game.world, "buzzards", false, true, Phaser.Physics.ARCADE);
	    this.bees = this.game.add.group(game.world, "bees", false, true, Phaser.Physics.ARCADE);
	    this.wasps = this.game.add.group(game.world, "wasps", false, true, Phaser.Physics.ARCADE);
	    this.balloons = this.game.add.group(game.world, "balloons", false, true, Phaser.Physics.ARCADE);
	    this.enemies.push(this.birds, this.buzzards, this.bees, this.wasps, this.balloons);
	},
	update: function () {
	    this.bgs[0].y = Math.round((this.game.camera.y * 0.9) + 256);

	    this.player.update(this.layer);

	    // Update enemies
	    for (var i in this.enemies) {
	        this.enemies[i].forEachAlive(function (enemy) {
	            if (enemy.instance) {
	                enemy.instance.update(this.player);
	            }
	        }, this);
	        this.game.physics.arcade.collide(this.player.sprite, this.enemies[i], function (player, enemy) {
	            enemy.instance.handleCollision(player);
	        }, null, this);
	    }

	    // Randomly spawn enemies
	    if (this.spawnTimer <= 0) {
	        this.spawnEnemies();
	        this.spawnTimer = this.spawnRate;
	    } else {
	        this.spawnTimer -= 1;
	    }
	},
	spawnEnemies: function () {
	    var startPos = {};
	    var startVel = {};
	    var modifier = rand(this.enemies.length);
	    switch(modifier) {
	        case 0:
	            if (Phaser.Utils.chanceRoll(50)) {
	                startPos.x = rand(512);
	                startPos.y = this.game.world.height + 32;
	                startVel = { x: 0, y: -30 };
	                var animations = [
	                    { name: "wiggle", frames: [0, 1], speed: 1 }
	                ];
	                var balloon = new Enemy(startPos, startVel, "balloon", animations, this.balloons);
	                balloon.init();
	                balloon.sprite.body.setSize(32, 32, 0, -32);
	            }
	            break;
	        case 1:
	            if (Phaser.Utils.chanceRoll(66)) {
	                startPos.x = Phaser.Utils.randomChoice(0, game.world.width);
	                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (this.player.sprite.body.position.y + rand(256)) : (this.player.sprite.body.position.y - rand(256));
	                startVel.x = (startPos.x === 0) ? 40 : -40;
	                startVel.y = 0;
	                new Enemy(startPos, startVel, "bird", [], this.birds, null, 1, 1).init();
	            }
	            break;
	        case 2:
	            if (Phaser.Utils.chanceRoll(33)) {
	                startPos.x = Phaser.Utils.randomChoice(0, this.game.world.width);
	                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (this.player.sprite.body.position.y + rand(256)) : (this.player.sprite.body.position.y - rand(256));
	                startVel.x = (startPos.x === 0) ? 50 : -50;
	                startVel.y = 0;
	                new Enemy(startPos, startVel, "buzzard", [], this.buzzards, "swoop", 1, 1).init();
	            }
	            break;
	        case 3:
	            if (Phaser.Utils.chanceRoll(50)) {
	                startPos.x = Phaser.Utils.randomChoice(0, this.game.world.width);
	                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (this.player.sprite.body.position.y + rand(256)) : (this.player.sprite.body.position.y - rand(256));
	                startVel.x = (startPos.x === 0) ? rand(20, 30) : -rand(20, 30);
	                startVel.y = Phaser.Utils.randomChoice(rand(20, 30), -rand(20, 30));
	                new Enemy(startPos, startVel, "bee", [], this.bees, null, 1, 1, true).init();
	            }
	            break;
	        case 4:
	            if (Phaser.Utils.chanceRoll(25)) {
	                startPos.x = Phaser.Utils.randomChoice(0, this.game.world.width);
	                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (this.player.sprite.body.position.y + rand(256)) : (this.player.sprite.body.position.y - rand(256));
	                startVel.x = (startPos.x === 0) ? rand(20, 40) : -rand(20, 40);
	                startVel.y = Phaser.Utils.randomChoice(rand(20, 40), -rand(20, 40));
	                new Enemy(startPos, startVel, "wasp", [], this.wasps, "dive", 1, 1, true).init();
	            }
	            break;
	        default:
	            break;
	    }
	}
};