var Attack = (function () {
    var instance;
    var attacks;
    var swoopingDistance;

    function init() {
        swoopingDistance = { x: 128, y: 256 };

        attacks = {
            swoop: function (actor, target) {
                var distance = {};
                distance.x = Math.abs(actor.sprite.body.position.x - target.sprite.body.position.x);
                if (!actor.attacking && distance.x < swoopingDistance.x) {
                    distance.y = target.sprite.body.position.y - actor.sprite.body.position.y;
                    if (distance.y > 0 && distance.y < swoopingDistance.y) {
                        actor.sprite.body.gravity.y = -600;
                        actor.sprite.body.velocity.setTo(actor.startVel.x * 3, 350);
                        actor.attacking = true;
                    }
                }
            }
        };
        return {
            attack: function (type, actor, target) {
                attacks[type](actor, target);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();