var Attack = (function () {
    var instance;
    var attacks;
    var bounds;

    function init() {
        bounds = {};
        bounds["swoop"] = { x: 128, y: 256 };
        bounds["dive"] = { x: 192, y: 192 };

        attacks = {
            swoop: function (actor, target) {
                actor.sprite.body.gravity.y = -600;
                actor.sprite.body.velocity.setTo(actor.startVel.x * 3, 350);
            },
            dive: function (actor, target) {
                var dx = -(actor.sprite.body.position.x - target.sprite.body.position.x);
                var dy = -(actor.sprite.body.position.y - target.sprite.body.position.y);
                actor.sprite.body.velocity.setTo(dx / 2, dy / 2);
            }
        };
        return {
            attack: function (type, actor, target) {
                attacks[type](actor, target);
            },
            getBounds: function (type) {
                return bounds[type];
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