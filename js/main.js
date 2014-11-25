var game = new Phaser.Game(512, 640, Phaser.AUTO, 'star-dreams', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.stage.backgroundColor = '#99C0FF';

    game.load.image('bg1-0', 'img/bg1-0.png');
    game.load.tilemap('level-1', 'img/tilemap-1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tilesheet-1', 'img/tilesheet-1.png');
    game.load.spritesheet('balloon', 'img/balloon.png', 32, 64);
    game.load.image('bird', 'img/bird-right-1.png');
    game.load.image('player', 'img/player.png');
}

var map;
var bgs = [];
var layer;
var player;
var cursors;
var birds;
var balloons;
var buttons = {};
var enemies;

function create() {

    bgs.push(game.add.tileSprite(0, 0, game.world.width, 512, 'bg1-0'));
    map = game.add.tilemap('level-1');
    map.addTilesetImage('tilesheet-1');
    map.setCollisionBetween(0, 11);
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = new Player({ x: 64, y: game.world.height - 96 }, 'player', []);
    player.init();

    enemies = [];
    birds = game.add.group(game.world, "birds", false, true, Phaser.Physics.ARCADE);
    balloons = game.add.group(game.world, "balloons", false, true, Phaser.Physics.ARCADE);
    enemies.push(birds, balloons);

    cursors = game.input.keyboard.createCursorKeys();
    buttons.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

var spawnRate = 25;
var spawnTimer = spawnRate;
function update() {
    bgs[0].y = Math.round((game.camera.y * 0.9) + 256);

    player.update();

    // Update enemies
    for (var i in enemies) {
        enemies[i].forEachAlive(function (enemy) {
            if (enemy.instance) {
                enemy.instance.update();
            }
        }, this);
        game.physics.arcade.collide(player.sprite, enemies[i], function (player, enemy) {
            enemy.instance.handleCollision(player);
            console.log(map);
        }, null, this);
    }

    // Randomly spawn enemies
    var modifier = Math.floor(Math.random() * 512 + 1);
    if (spawnTimer <= 0) {
        if (modifier % 23 === 0) {
            var startPos = {};
            var startVel = {};
            startPos.x = (modifier % 2 === 0) ? 0 : game.world.width;
            startPos.y = (modifier % 5 === 0) ? (player.sprite.body.position.y + (modifier / 2)) : (player.sprite.body.position.y - modifier);
            startVel.x = (startPos.x === 0) ? 40 : -40;
            startVel.y = 0;
            var bird = new Enemy(startPos, startVel, "bird", [], birds, 1, 1);
            bird.init();
        } else if (modifier % 61 === 0) {
            var startPos = {};
            var startVel = { x: 0, y: -30 };
            startPos.x = Math.floor(Math.random() * game.world.width + 1);
            startPos.y = game.world.height;
            var animations = [{ name: "wiggle", frames: [0, 1], speed: 1 }];
            var balloon = new Enemy(startPos, startVel, "balloon", animations, balloons);
            balloon.init();
            balloon.sprite.body.setSize(32, 32, 0, -32);
        }
        spawnTimer = spawnRate;
    } else {
        spawnTimer -= 1;
    }
}

function render() {

}