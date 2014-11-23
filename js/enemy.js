function Enemy(startPos, startVel, key, animations, group, maxHealth, damage) {
    this.startPos = startPos;
    this.startVel = startVel;
    this.key = key;
    this.animations = animations;
    this.group = group;
    if (maxHealth === undefined) {
        this.maxHealth = 1;
    } else {
        this.maxHealth = maxHealth;
    }
    if (damage === undefined) {
        this.damage = 0;
    } else {
        this.damage = damage;
    }
    this.anchor = { x: 0.5, y: 1 };
}
Enemy.prototype.init = function () {
    this.sprite = this.group.create(this.startPos.x, this.startPos.y, this.key);
    this.sprite.instance = this;
    this.sprite.anchor.setTo(this.anchor.x, this.anchor.y);
    this.sprite.scale.x = (this.startVel.x > 0) ? 1 : -1;
    if (this.animations.length !== 0) {
        this.sprite.animations.add(this.animations[0].name, this.animations[0].frames, this.animations[0].speed, true);
    }
    this.sprite.body.velocity.setTo(this.startVel.x, this.startVel.y);
    this.sprite.health = this.maxHealth;
}
Enemy.prototype.update = function () {
    if (this.animations.length !== 0) {
        this.sprite.animations.play(this.animations[0].name);
    }
    if (this.sprite.body.center.x > (game.world.width + this.sprite.body.width) || this.sprite.body.center.x < 0
        || this.sprite.body.center.y > (game.world.height + this.sprite.body.height) || this.sprite.body.center.y < 0) {
        this.sprite.kill();
    }
}
Enemy.prototype.handleCollision = function (player) {
    if (player.body.center.y < this.sprite.body.center.y) {
        player.body.velocity.y = -350;
    } else {
        player.body.velocity.y *= -1;
        player.damage(this.damage);
    }
    this.sprite.damage(1);
}