"use strict"

let Laser = function() {
    this.type = 3
    augment(this, _Actor)

    this.radius = 0.01
    this.scale = [0.1, 0.1, 0.1]
    this.speed = 12
    this.power = 10
    this.life = 2.5

    this.join = function(src) {
        this.source = src
        this.power = src.POWER
        this.yaw = src.yaw + (src.CYAW * src.dyaw)
        this.roll = src.roll
        this.pitch = src.pitch
        this.evo(0.07)

        switch(src.team) {
        case 0:
            this.model.ambient = [2, 2, 2]
            break;
        case 1:
            this.model.ambient = [2, 2, 0]
            break;
        case 2:
            this.model.ambient = [3, 1, 0]
            break;
        case 3:
            this.model.ambient = [2, 0.3, 0]
            break;
        case 4:
            this.model.ambient = [0.5, 1.5, 2]
            break;
        }
    }

    this.hit = function(t) {
        // hit the target
        switch(t.type) {
        case 1:
        case 2:
            if (this.source == t) return
            //if (t.type == 2 && t.up == 0) return // don't hit energy powerups
            this.kill()
            t.shield -= this.power
            if (t.shield <= 0) {
                t.kill(t.source)
            }
            break;
        }
    }

    this.evo = function(delta) {
        this.x += Math.sin(this.yaw) * this.speed * delta
        this.z += Math.cos(this.yaw) * this.speed * delta
        this.life -= delta
        if (this.life < 0) {
            this.kill()
        }
    }

    this.model = new Octa(8, 8, 0.3, 0.3, material[4])
    this.model.shading = 1
    this.ambient = [2, 2, 0]
    this.model.bind()

    this.render = function() {
        mvPushMatrix()
        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.scale(mvMatrix, this.scale);
        mat4.rotate(mvMatrix, this.yaw, [0, 1, 0]);
        mat4.rotate(mvMatrix, this.roll, [0, 0, 1]);
        mat4.rotate(mvMatrix, this.pitch, [1, 0, 0]);

        this.model.render();

        mvPopMatrix()
    }

    this.kill = function() {
        this.alive = false
        //sfx(10, 1, this)
    }
}
