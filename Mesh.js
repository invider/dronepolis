/*
 * Single geometry with one texture
 */

// extend array prototype
Array.prototype.pushArray = function(arr) {
        this.push.apply(this, arr);
};

function Mesh() {
    // relative shift and orientation
    this.strip = false
    this.shading = 0
    this.ambient = [1,1,1]
    this.dirLight = [1,1,1]
    this.x = 0
    this.y = 0
    this.z = 0
    this.pitch = 0
    this.yaw = 0
    this.roll = 0
    this.scale = [1, 1, 1]

    this.shiftX = function(v) {
        for (let i = 0; i < this.vtx.length; i+=3) this.vtx[i] += v
    }

    this.shiftY = function(v) {
        for (let i = 1; i < this.vtx.length; i+=3) this.vtx[i] += v
    }

    this.shiftZ = function(v) {
        for (let i = 2; i < this.vtx.length; i+=3) this.vtx[i] += v
    }

    this.normals = function() {
        this.norm = []
        let i = 0;
        let b = this.vtx
        while (i < b.length-8) {
            let v1 = vec3.set([b[i]-b[i+3], b[i+1]-b[i+4], b[i+2]-b[i+5]], vec3.create())
            let v2 = vec3.set([b[i]-b[i+6], b[i+1]-b[i+7], b[i+2]-b[i+8]], vec3.create())
            let v3 = vec3.normalize(vec3.cross(v1, v2, vec3.create()), vec3.create())

            this.norm.pushArray(v3)
            if (this.strip) i+=3
            else {
                this.norm.pushArray(v3)
                this.norm.pushArray(v3)
                i+=9
            }
        }
    }

    this.bind = function() {
        var n = this.vtx.length/3
        this.vposBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtx), gl.STATIC_DRAW);
        this.vposBuffer.itemSize = 3;
        this.vposBuffer.numItems = n;

        this.texCoordBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tex), gl.STATIC_DRAW);
        this.texCoordBuf.itemSize = 2;
        this.texCoordBuf.numItems = n;

        this.normals()
        this.normBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.norm), gl.STATIC_DRAW)
    }

    this.draw = function() {
        // setup vertex, texture and normal buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuf)
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

        // draw
        if (this.strip) {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vposBuffer.numItems);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vposBuffer.numItems);
        }
    }

    this.render = function() {
        mvPushMatrix()

        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        if (this.scale) mat4.scale(mvMatrix, this.scale);
        if (this.roll) mat4.rotate(mvMatrix, this.roll, [0, 0, 1]);
        if (this.pitch) mat4.rotate(mvMatrix, this.pitch, [1, 0, 0]);
        if (this.yaw) mat4.rotate(mvMatrix, this.yaw, [0, 1, 0]);

        setMoveUniforms();
        setNormalUniforms()

        // set shading type and lighting
        gl.uniform3fv(shaderProgram.ambientLight, this.ambient)
        gl.uniform3fv(shaderProgram.dirLight, this.dirLight)
        gl.uniform1i(shaderProgram.uShading, this.shading)
        // bind texture 
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        this.draw()
        
        // back to original transformation
        mvPopMatrix()
    }
}

function Cube(texture) {
    this.vtx = [
        0,0,0, 0,1,0, 1,0,0,
        0,1,0, 1,1,0, 1,0,0,
        0,0,1, 1,0,1, 0,1,1,
        1,0,1, 1,1,1, 0,1,1,
        0,1,1, 1,1,1, 0,1,0,
        1,1,1, 1,1,0, 0,1,0,
        0,0,0, 1,0,1, 0,0,1,
        1,0,1, 0,0,0, 1,0,0,
        0,0,0, 0,0,1, 0,1,0,
        0,1,0, 0,0,1, 0,1,1,
        1,0,0, 1,1,0, 1,0,1,
        1,0,1, 1,1,0, 1,1,1,
    ]
    // shift model to 0x0
    for (let i = 0; i < this.vtx.length; i++) {
        this.vtx[i] = this.vtx[i] - 0.5
    }

    this.tex = [
         1,0, 1,1, 0,0, 1,1, 0,1, 0,0,
         1,0, 0,0, 1,1, 0,0, 0,1, 1,1,

         1,0, 0,0, 1,1, 0,0, 0,1, 1,1,
         1,0, 0,1, 1,1, 0,1, 1,0, 0,0,
         //0,0, 1,1, 1,0, 1,0, 0,1, 0,0,

         1,0, 0,0, 1,1, 1,1, 0,0, 0,1,
         1,0, 1,1, 0,0, 0,0, 1,1, 0,1,
    ]
    this.texture = texture

    this.evo = function(delta) {
        this.yaw -= 1 * delta
        this.pitch -= 0.6 * delta
    }
}
Cube.prototype = new Mesh()

function Octa(f, b, w, h, texture) {
    this.vtx = [
        0, 0, -f,   -w, 0, 0,   0, h, 0,
        0, 0, -f,   0, h, 0,    w, 0, 0,
        0, 0, -f,   0, -h, 0,  -w, 0, 0,
        0, 0, -f,   w, 0, 0,    0, -h, 0,
        0, 0, b,    0, h, 0,   -w, 0, 0,
        0, 0, b,    w, 0, 0,    0, h, 0,
        0, 0, b,    -w, 0, 0,   0, -h, 0,
        0, 0, b,    0, -h, 0,   w, 0, 0,
    ]
    
    this.tex = [
        0, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 1, 0,
        0, 0, 0, 1, 1, 0,
        0, 0, 0.1, 0.1, 0.1, 0,
        0, 0, 0.1, 0.1, 0.1, 0,
        0, 0, 0.1, 0.1, 0.1, 0,
        0, 0, 0.1, 0.1, 0.1, 0,
        //0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        //0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        //0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        //0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
    ]
    this.texture = texture

    this.evo = function(delta) {
        this.yaw -= 0.4 * delta
        this.pitch -= 0.05 * delta
    }
}
Octa.prototype = new Mesh()

Quad = function(texture) {
    this.vtx = [
        0,0,1, 1,0,1, 0,0,0,
        1,0,1, 1,0,0, 0,0,0,
    ]
    this.shiftX(-0.5)
    this.shiftZ(-0.5)

    this.tex = [
         1,0, 1,1, 0,0, 1,1, 0,1, 0,0,
    ]
    this.texture = texture

    this.evo = function(delta) {
        //this.yaw -= 1 * delta
        //this.pitch -= 0.6 * delta
    }
}
Quad.prototype = new Mesh()
