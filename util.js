// mixins
augment = function() {
    var arg;
    var mixin = arguments[0];
    for (arg = 1; arg < arguments.length; arg++) {
        for (let prop in arguments[arg]) {
            mixin[prop] = arguments[arg][prop];
        }
    }
    return mixin;
}

before = function(obj, fun, patch) {
    var orig = obj[fun]
    obj[fun] = function() {
        patch.apply(this, arguments)
        orig.apply(this, arguments)
    }
}

after = function(obj, fun, patch) {
    var orig = obj[fun]
    obj[fun] = function() {
        orig.apply(this, arguments)
        patch.apply(this, arguments)
    }
}


// extend window with universal requestAnimFrame
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
            window.setTimeout(callback, 1000/60);
         };
})();

function normalizeCanvas(canvas) {
}

function expandCanvas() {
    var newWidth = window.innerWidth
    var newHeight = window.innerHeight

    var canvas = document.getElementById('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    canvas = document.getElementById('radar')
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'

    render(0)
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    /*
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    */
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    setMoveUniforms()
    setNormalUniforms()
}

function setMoveUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function setNormalUniforms() {
    let normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function createTexture(type, frame, lines) {
    var texture = gl.createTexture();
    texture.image = generateTerminalImage(type, frame, lines)
    _resources++
    texture.image.onload = function () {
        _loaded++
        handleLoadedTexture(texture)
    }
    return texture
}

function dist(x1, z1, x2, z2) {
    return Math.sqrt((x2-x1)*(x2-x1) + (z2-z1)*(z2-z1))
}

function limitRange(val, min, max) {
    if (val < min) return min;
    return val>max? max : val;
}

function limitMin(val, min) {
    return val<min? min : val
}

function limitMax(val, max) {
    return val>max? max : val
}

function down(val, min, step) {
    val -= step
    return val < min? min : val
}

// global const
let PI = Math.PI
let PI2 = PI*2

function normAngle(a) {
    return a - PI2 * Math.floor((a + PI) / PI2)
}

abs = Math.abs
floor = Math.floor

// LCG random generator implementation
var _rnd_m = 0xFFFFFFFF, _rnd_a = 1664525, _rnd_c = 1013904223;
var _seed = 1
function rndv() {
    _seed = (_rnd_a * _seed + _rnd_c) % _rnd_m
    return _seed
}

function rndf() {
    return rndv()/_rnd_m
}

function rndfi() {
    return rndf()*PI2 - PI
}

function rnd(maxValue){
    return rndv()/_rnd_m * maxValue
}

function rndi(maxValue){
    return ~~rnd(maxValue)
}

function rnds() {
    return rndf() < .5? -1 : 1
}
