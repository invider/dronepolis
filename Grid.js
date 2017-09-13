SCALE = 5
HSC = SCALE/2

function Grid(level) {

let grid = this

_seed = level * 5723
this.width = 16 + level*6
this.gwidth = this.width * SCALE

this.lat = []
this.atlas = []

// fill atlas with models
this.atlas[0] = new Quad(material[16])
this.atlas[0].bind()
this.atlas[0].scale = [SCALE,SCALE,SCALE]

this.atlas[1] = new Quad(material[3])
this.atlas[1].bind()
this.atlas[1].scale = [SCALE,SCALE,SCALE]

this.atlas[2] = new Quad(material[5])
this.atlas[2].bind()
this.atlas[2].scale = [SCALE,SCALE,SCALE]

this.atlas[101] = new Cube(material[17])
this.atlas[101].bind()
this.atlas[101].y = -SCALE/2
this.atlas[101].scale = [SCALE,SCALE,SCALE]

this.atlas[102] = new Cube(material[11])
this.atlas[102].bind()
this.atlas[102].y = -SCALE/2
this.atlas[102].scale = [SCALE,SCALE,SCALE]

this.atlas[103] = new Cube(material[8])
this.atlas[103].bind()
this.atlas[103].y = -SCALE/2
this.atlas[103].scale = [SCALE,SCALE,SCALE]

this.atlas[104] = new Cube(material[12])
this.atlas[104].bind()
this.atlas[104].y = -SCALE/2
this.atlas[104].scale = [SCALE,SCALE,SCALE]

this.atlas[105] = new Cube(material[9])
this.atlas[105].bind()
this.atlas[105].y = -SCALE/2
this.atlas[105].scale = [SCALE,SCALE,SCALE]

this.atlas[106] = new Cube(material[7])
this.atlas[106].bind()
this.atlas[106].y = -SCALE/2
this.atlas[106].scale = [SCALE,SCALE,SCALE]

// init the grid
let fence = 101 + rndi(6)
for (var x = 0; x < this.width; x++) {
    this.lat[x] = []
    for (var z = 0; z < this.width; z++) {
        this.lat[x][z] = 0
        if (x == 0 || x == this.width-1) this.lat[x][z] = fence
        if (z == 0 || z == this.width-1) this.lat[x][z] = fence
    }
}

this.build = function(x, z, b) {
    if (x > 2 && x < this.width-4
            && z > 2 && z < this.width-4) {
        this.lat[x][z] = b
    }
}

this.rect = function(x, z, w, h, b) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            this.build(x+i, j+z, b)
        }
    }
}

this.block = function() {
    type = 101 + rndi(6)
    let w = 1 + rndi(3)
    let h = 1 + rndi(3)
    let x = 2 + rndi(this.width-4)
    let z = 2 + rndi(this.width-4)
    this.rect(x, z, w, h, type)
}

this.dirt = function() {
    type = 1 + rndi(2)
    let w = 1 + rndi(3)
    let h = 1 + rndi(3)
    let x = 2 + rndi(this.width-4)
    let z = 2 + rndi(this.width-4)
    this.rect(x, z, w, h, type)
}

// generate some building and spots
for (let i = 0; i < this.width; i++) {
    this.dirt()
    this.dirt()
}
for (let i = 0; i < this.width; i++) {
    this.block()
    this.dirt()
}




function loc(x) {
    return (x+HSC)/SCALE 
}

function glob(x) {
    return x * SCALE
}

this.gloc = function(x) {
    let gx = floor((x+HSC)/SCALE)
    if (gx > this.width) return -1
    return gx
}

function tst(x,z,r,tx,tz) {
    // test map ranges
    if (tx < 0 || tx >= grid.width
            || tx < 0 || tz >= grid.width) return false // out of this map

    if (grid.lat[tx][tz] <= 100) return true // an empty cell

    // solid cell - test if we are touching it
    return !(x+r >= tx
            && x-r <= tx+1
            && z+r >= tz
            && z-r <= tz+1)
}

this.free = function(x, z, r) {
    let lx = loc(x)
    let lz = loc(z)
    let lr = r/SCALE
    let tx = this.gloc(x)
    let tz = this.gloc(z)

    if (tx < 0 || tx >= this.width
            || tz < 0 || tz >= this.width) return true // object is out of map

    return tst(lx, lz, lr, tx, tz)
        && tst(lx, lz, lr, tx-1, tz)
        && tst(lx, lz, lr, tx+1, tz)
        && tst(lx, lz, lr, tx, tz-1)
        && tst(lx, lz, lr, tx, tz+1)
        && tst(lx, lz, lr, tx-1, tz+1)
        && tst(lx, lz, lr, tx-1, tz-1)
        && tst(lx, lz, lr, tx+1, tz+1)
        && tst(lx, lz, lr, tx+1, tz-1)
}

this.freeSpot = function() {
    let i = rndi(this.width * this.width)
    let lx = floor(i / this.width)
    let lz = i % this.width
    if (this.lat[lx][lz] < 100) {
        return [glob(lx), glob(lz)]
    }
    return this.freeSpot()
}

this.collide = function(t, d) {
    if (!this.free(t.x, t.z, 0.1)) t.kill()
}

this.render = function() {
    // calculate culling
    var lx = floor(loc(target.x))
    var lz = floor(loc(target.z))
    var sx = limitMin(lx-CULLING/SCALE, 0)
    var sz = limitMin(lz-CULLING/SCALE, 0)
    var mx = limitMax(lx+CULLING/SCALE, this.width)
    var mz = limitMax(lz+CULLING/SCALE, this.width)

    let i = 0
    for (let x = sx; x < mx; x++) {
        for (let z = sz; z < mz; z++) {
            let model = this.atlas[this.lat[x][z]]
            model.x = glob(x)
            model.z = glob(z)
            model.render()
            env.modelsCount++
            i++
        }
    }
}

}
