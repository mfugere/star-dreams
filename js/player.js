function Player(startPos, key, animations) {
    this.startPos = startPos;
    this.key = key;
    this.animations = animations;
    this.maxHealth = 5;
    this.gravity = 600;
    this.bounce = 0.1;
    this.size = { x: 32, y: 32 };
    this.anchor = { x: 0.5, y: 1 };
}
Player.prototype.init = function () {
    this.sprite = game.add.sprite(this.startPos.x, this.startPos.y, this.key);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    game.camera.follow(this.sprite);
    this.sprite.health = this.maxHealth;
    this.sprite.body.gravity.y = this.gravity;
    this.sprite.body.bounce.y = this.bounce;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setSize(this.size.x, this.size.y, 0, 0);
    this.sprite.anchor.setTo(this.anchor.x, this.anchor.y);
    this.sprite.instance = this;
    if (this.animations.length !== 0) {
        this.sprite.animations.add(this.animations[0].name, this.animations[0].frames, this.animations[0].speed, true);
    }
}
Player.prototype.update = function (layer) {
    this.sprite.body.velocity.x = 0;
    game.physics.arcade.collide(this.sprite, layer);
    if (this.animations.length !== 0) {
        this.sprite.animations.play(this.animations[0].name);
    }

    // Input
    if (cursors.left.isDown) {
        this.sprite.body.velocity.x = -150;
        this.sprite.scale.x = 1; // TODO: Reverse these when the proper sprite is done.
    }
    else if (cursors.right.isDown) {
        this.sprite.body.velocity.x = 150;
        this.sprite.scale.x = -1;
    }
    if (buttons.jump.isDown && this.sprite.body.onFloor()) {
        this.sprite.body.velocity.y = -350;
    }

    if (!this.sprite.alive) {
        game.destroy(); // TODO: Replace this with something UI-based.
    }
}
Player.prototype.damage = function (amt) {
    this.sprite.health -= amt;
    if (this.sprite.health <= 0) this.sprite.kill();
}