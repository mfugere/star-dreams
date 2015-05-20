var game = new Phaser.Game(512, 640, Phaser.AUTO, "", "level1");
var cursors, buttons;

game.state.add("level1", Level1);

function rand(to, from) {
    return (from === undefined) ? Math.floor(Math.random() * to) : Math.floor(Math.random() * to + from);
}