function initGL(canvas) {
    try {
        //gl = canvas.getContext("experimental-webgl");
		gl = canvas.getContext("webgl", {
			alpha: false
		});
        expandCanvas()
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("no webgl!" + e);
    }
}

function init() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    generateTextures()

    setupSFX()

    // setup gl
    gl.clearColor(0.07, 0.0, 0.15, 1.0); // scene background color
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // map event handlers
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.oncontextmenu = handleMouse;
    window.addEventListener('resize', expandCanvas, false)

    // initiate main cycle
    start()
    cycle();
}
document.addEventListener("DOMContentLoaded", init);
