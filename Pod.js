"use strict"


let Pod = function() {
    augment(this, _Actor)
    this.type = 2
    this.name = "Pod"

    this.radius = 0.2
    this.speed = 0
    this.shield = 10 + rndi(40)
    this.scale = [.3, .3, .3]
    this.POD_FRICTION = 0.5

    this.drift = function() {
        this.yaw = rndfi()
        this.speed = 1 + rndi(3)
    }

    this.evo = function(delta) {
        this.snap() // store current xyz for future rewind if necessary

        this.x += Math.sin(this.yaw) * this.speed * delta
        this.z += Math.cos(this.yaw) * this.speed * delta
        this.speed = down(this.speed, 0, this.POD_FRICTION * delta)

        if (!grid.free(this.x, this.z, this.radius*10)) {
            // collision - hit the wall!
            this.rewind() // restore previous coordinates
            this.speed = -this.speed
        }

        this.model.evo(delta)
    }

    this.up = rndi(2)
    switch (this.up) {
        case 0:
            this.model = new Octa(1, 1, 1, 1, material[18])
            this.model.bind()
            this.model.scale = [0.6, 0.6, 0.6]
            this.model.evo = function(delta) {
                this.yaw -= .8 * delta
            }
            break;
        case 1:
            this.model = new Cube(material[10])
            this.model.scale = [1, 1, 1]
            this.model.bind()
            break; 
    }
    
    this.hit = function(t) {
        switch(t.type) {
        case 1:
            // pick up - apply effect
            this.kill()
            switch(this.up) {
            case 0:
                t.shield += this.shield
                sfx(1, 1, this)
                if (target == t) {
                    message("Energy +" + this.shield, 2)
                }
                break;
            case 1:
                t.upgrade()
                sfx(4, 1, this)
            }
            break;
        }
    }

    this.render = function() {
        // rotate and translate
        mvPushMatrix()
        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.scale(mvMatrix, this.scale);
        mat4.rotate(mvMatrix, this.yaw, [0, 1, 0]);
        mat4.rotate(mvMatrix, this.roll, [0, 0, 1]);
        mat4.rotate(mvMatrix, this.pitch, [1, 0, 0]);

        this.model.render();

        // back to original transformation
        mvPopMatrix()
    }
}
