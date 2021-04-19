function initGL(canvas) {
    //gl = canvas.getContext("experimental-webgl");
    gl = canvas.getContext("webgl", {
        alpha: false,
    });
    expandCanvas()
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

function init() {
    radarCanvas = document.getElementById("radar");
    ctx = radarCanvas.getContext("2d");

    // setup radar
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    // setup text overlay
    overlayData = true
    overlay = document.getElementById("overlay")
    trace = document.getElementById("trace")
    statusBar = document.getElementById("status")
    messageBar = document.getElementById("message") 

    // setup gl
    gl.clearColor(0.03, 0.0, 0.1, 1.0); // scene background color
    //gl.clearColor(1, 1, 1, 1.0); // test white background
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // TODO find out what with Chrome?
    gl.cullFace(gl.GL_BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    

    // map event handlers
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.oncontextmenu = handleMouse;
    window.addEventListener('resize', expandCanvas, false)
    document.onvisibilitychange = function(e) {
        if (document.visibilityState == 'hidden') env.pause = true
    }

    // generate resources
    generateMaterials()
    generateSFX()

    // initiate main cycle
    start()
    cycle();
}
document.addEventListener("DOMContentLoaded", init);
