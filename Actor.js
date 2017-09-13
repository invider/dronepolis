_Actor = {

    alive: true,
    radius: 1,
    pitch: 0,
    yaw: 0,
    roll: 0,
    scale: [1, 1, 1],

    init: function(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    },

    dist: function(t) {
        return dist(this.x, this.z, t.x, t.z)
    },

    // direction angle on target
    dir: function(t) {
        return Math.atan2(t.x - this.x, t.z - this.z)
    },

    collide: function(t) {
        let orig = vec3.set([this.x, this.y, this.z], vec3.create())
        let tar = vec3.set([t.x, t.y, t.z], vec3.create())
        let diff = vec3.create()
        let dist = vec3.length(vec3.subtract(orig, tar, vec3.create()))
        if (dist < this.radius + t.radius) this.hit(t)
    },

    snap: function() {
        this._x = this.x
        this._y = this.y
        this._z = this.z
    },

    rewind: function() {
        this._x = this.x
        this._y = this.y
        this._z = this.z
    },

    hit: function() {
    },

    kill: function() {
        this.alive = false
    },

    toString: function() {
        return this.name
    }
}
