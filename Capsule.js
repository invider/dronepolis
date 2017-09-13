"use strict"

let Capsule = function() {
    this.type = 2
    augment(this, _Actor)

    this.speed = 0
    this.shield = 10

    after(this, 'init', function() {
        //this.scale = [.5, .5, .5]
        this.scale = [2.5, 2.5, 2.5]
    })

    this.evo = function(delta) {
        this.model.evo(delta)
    }

    this.model = new Cube(material[10])
    this.model.bind()

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
