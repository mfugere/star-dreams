function Enemy(startPos, startVel, key, animations, group, attackType, maxHealth, attackPts) {
    this.startPos = startPos;
    this.startVel = startVel;
    this.key = key;
    this.animations = animations;
    this.group = group;
    if (attackType !== undefined) {
        this.attackType = attackType;
    }
    if (maxHealth === undefined) {
        this.maxHealth = 1;
    } else {
        this.maxHealth = maxHealth;
    }
    if (attackPts === undefined) {
        this.attackPts = 0;
    } else {
        this.attackPts = attackPts;
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
    this.attacking = false;
};
Enemy.prototype.update = function (player) {
    if (this.animations.length !== 0) {
        this.sprite.animations.play(this.animations[0].name);
    }
    if (this.sprite.body.center.x > (game.world.width + this.sprite.body.width) || this.sprite.body.center.x < 0
        || this.sprite.body.center.y < 0) {
        this.sprite.kill();
    }
    if (this.attackType) {
        this.attack(player);
    }
};
Enemy.prototype.handleCollision = function (player) {
    if (player.body.center.y < this.sprite.body.center.y) {
        player.body.velocity.y = -350;
    } else {
        player.body.velocity.y *= -1;
        player.instance.damage(this.attackPts);
    }
    this.damage(1);
};
Enemy.prototype.attack = function (target) {
    Attack.getInstance().attack(this.attackType, this, target);
};
Enemy.prototype.damage = function (amt) {
    this.sprite.health -= amt;
    if (this.sprite.health <= 0) this.sprite.kill();
}