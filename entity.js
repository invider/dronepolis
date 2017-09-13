function Entity() {

    this.kind = 0

    // executed when spawned
    this.initPos = function(x, y, z) {
        this.alive = true
        this.strip = false
        this.solid = true
        this.x = x
        this.y = y
        this.z = z
        this.h = 1
        this.radius = 0.5
        this.pitch = 0
        this.yaw = 0
        this.roll = 0 
        this.scale = [1, 1, 1]

        this.dx = 0
        this.dy = 0
        this.dz = 0
    }

    this.initBufs = function(vtx, tex, n) {
        this.vposBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
        this.vposBuffer.itemSize = 3;
        this.vposBuffer.numItems = n;

        this.texCoordBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
        this.texCoordBuf.itemSize = 2;
        this.texCoordBuf.numItems = n;
    }

    // executed when spawned after initPos
    this.init = function() {
        // generate geometry
        var vtxPos = []
        var texCoord = []

        var vtxPos = [
            -1, -1, -1, -1,  1, -1, -1, -1,  1,
            -1,  1, -1, -1, -1,  1, -1,  1,  1,
            
            -1, -1,  1, -1,  1,  1, 1, -1,  1,
            -1,  1,  1,  1, -1,  1, 1,  1,  1,
            
             1, -1,  1, 1,  1,  1, 1, -1, -1,
             1,  1,  1, 1, -1, -1, 1,  1, -1,

             1, -1, -1,  1,  1, -1, -1, -1, -1,
             1,  1, -1, -1, -1, -1, -1,  1, -1,
        ]
        
        var texPos = [
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
            0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1,
        ]
        this.initBufs(vtxPos, texPos, 24)

        // asign texture
        this.type = 0
        this.texture = material[17]
    }

    this.evo = function(delta) {
        // update
        this.x += this.dx*delta
        this.y += this.dy*delta
        this.z += this.dz*delta
        //this.roll += 0.4*delta
        //this.yaw += 0.2*delta
        //this.pitch += 0.1*delta
        if (this.postUpdate) this.postUpdate(delta)
    }

    this.touch = function(x, z, r) {
        return this.x-this.radius <= x+r
                && this.x+this.radius >= x-r
                && this.z-this.radius <= z+r
                && this.z+this.radius >= z-r;
    }

    this.hit = function() {}

    this.drawModel = function() {
        // draw
        if (this.strip) {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vposBuffer.numItems);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vposBuffer.numItems);
        }
        if (this.postRender) this.postRender()
    }

    this.render = function() {
        return
        // render

        // rotate and translate
        setMatrixUniforms()
        mvPushMatrix()

        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.scale(mvMatrix, this.scale);
        mat4.rotate(mvMatrix, -this.roll, [0, 0, 1]);
        mat4.rotate(mvMatrix, -this.pitch, [1, 0, 0]);
        mat4.rotate(mvMatrix, -this.yaw, [0, 1, 0]);

        setMoveUniforms();

        // bind texture 
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        // setup vertex and texture buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuf);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.texCoordBuf.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vposBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vposBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.drawModel()
        for (var floor = 1; floor < this.h; floor++) {
            mat4.translate(mvMatrix, [0, 2, 0]);
            setMoveUniforms();
            this.drawModel()
        }
        
        // back to original transformation
        mvPopMatrix()
    }
}
