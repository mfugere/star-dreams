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
var buzzards;
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
    buzzards = game.add.group(game.world, "buzzards", false, true, Phaser.Physics.ARCADE);
    balloons = game.add.group(game.world, "balloons", false, true, Phaser.Physics.ARCADE);
    enemies.push(birds, buzzards, balloons);

    cursors = game.input.keyboard.createCursorKeys();
    buttons.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

var spawnRate = 250;
var spawnTimer = spawnRate;
function update() {
    bgs[0].y = Math.round((game.camera.y * 0.9) + 256);

    player.update();

    // Update enemies
    for (var i in enemies) {
        enemies[i].forEachAlive(function (enemy) {
            if (enemy.instance) {
                enemy.instance.update(player);
            }
        }, this);
        game.physics.arcade.collide(player.sprite, enemies[i], function (player, enemy) {
            enemy.instance.handleCollision(player);
        }, null, this);
    }

    // Randomly spawn enemies
    if (spawnTimer <= 0) {
        spawnEnemies();
        spawnTimer = spawnRate;
    } else {
        spawnTimer -= 1;
    }
}

function render() {

}

function spawnEnemies() {
    var startPos = {};
    var startVel = {};
    var modifier = rand(enemies.length);
    console.log(modifier);
    switch(modifier) {
        case 0:
            if (Phaser.Utils.chanceRoll(33)) {
                startPos.x = rand(512);
                startPos.y = game.world.height + 32;
                startVel = { x: 0, y: -30 };
                var animations = [
                    { name: "wiggle", frames: [0, 1], speed: 1 }
                ];
                var balloon = new Enemy(startPos, startVel, "balloon", animations, balloons);
                balloon.init();
                balloon.sprite.body.setSize(32, 32, 0, -32);
            }
            break;
        case 1:
            if (Phaser.Utils.chanceRoll(50)) {
                startPos.x = Phaser.Utils.randomChoice(0, game.world.width);
                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (player.sprite.body.position.y + rand(256)) : (player.sprite.body.position.y - rand(256));
                startVel.x = (startPos.x === 0) ? 40 : -40;
                startVel.y = 0;
                new Enemy(startPos, startVel, "bird", [], birds, null, 1, 1).init();
            }
            break;
        case 2:
            if (Phaser.Utils.chanceRoll(25)) {
                startPos.x = Phaser.Utils.randomChoice(0, game.world.width);
                startPos.y = (Phaser.Utils.chanceRoll(10)) ? (player.sprite.body.position.y + rand(256)) : (player.sprite.body.position.y - rand(256));
                startVel.x = (startPos.x === 0) ? 50 : -50;
                startVel.y = 0;
                new Enemy(startPos, startVel, "bird", [], buzzards, "swoop", 1, 1).init();
            }
            break;
        default:
            break;
    }
}

function rand(to, from) {
    return (from === undefined) ? Math.floor(Math.random() * to) : Math.floor(Math.random() * to + from);
}