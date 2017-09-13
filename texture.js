function generateMaterial(material) {
    var color = [128, 128, 128, 0, 0, 255]
    var stroke
    var lit
    var width = 256
    var height = 256
    var tcanvas = document.createElement("canvas");

    tcanvas.width = width
    tcanvas.height = height
    var ctx = tcanvas.getContext("2d");

    switch(material) {
        case 0: drawNoise();
                break;

        case 1: 
                color = [3, 2, 0, 1, 60, 60, -50]
                drawPerlin(0, 255, 1)
                break;

        // rusty brown metal
        case 2: 
                color = [0.8, 0.6, 0.6, 1, 10, 10, 20]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.2, 0.2, 0.3, 0, 0, 0]
                drawPerlin(44, 100, 2)

                color = [1.2, 0.3, 0.3, 1, 0, 0, 0]
                drawPerlin(47, 100, 2)

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);
                break;

        // soil
        case 3: color = [1, 1, 1, 1, 0, 0, -20]
                drawPerlin(0, 120, 0)
                break;
        // concrete
        case 4: color = [1, 1, 1, 1, 100, 100, 100]
                drawPerlin(0, 255, 0)
                break;
        // violet rock
        case 5: color = [1.5, 1.5, 3, 1, 0, 0, 0]
                drawPerlin(40, 255, 0)
                break;
        // violet brick
        case 6: color = [1, 1, 2, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)
                ctx.strokeStyle="#202070";
                ctx.lineWidth="3";
                drawBricks()
                break;

        // rusty blue metal
        case 7: 
                color = [0.6, 0.6, 0.9, 1, 10, 10, 20]
                drawPerlin(0, 255, 0)

                color = [0.4, 0.3, 0.6, 0.9, 0, 0, 0]
                drawPerlin(47, 100, 2)

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);
                break;
        // blue metal
        case 8: 
                color = [0.6, 0.6, 1, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);
                break;

        // rusty brown metal
        case 9: 
                color = [0.8, 0.6, 0.6, 1, 10, 10, 20]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.2, 0.2, 0.3, 0, 0, 0]
                drawPerlin(44, 100, 2)

                color = [1.2, 0.3, 0.3, 1, 0, 0, 0]
                drawPerlin(47, 100, 2)

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);
                break;
        // rusty brown metal 2
        case 10: 
                color = [0.7, 0.5, 0.5, 1, 10, 10, 20]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.2, 0.2, 0.3, 0, 0, 0]
                drawPerlin(44, 100, 2)

                color = [0.9, 0.3, 0.3, 1, 0, 0, 0]
                drawPerlin(48, 100, 2)

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);

                break;

        // techno-metal brown
        case 11: 
                color = [0.7, 0.5, 0.5, 1, 10, 10, 20]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.2, 0.2, 0.3, 0, 0, 0]
                drawPerlin(44, 100, 2)

                color = [0.9, 0.3, 0.3, 1, 0, 0, 0]
                drawPerlin(48, 100, 2)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 15
                for (var i = 0; i < 15; i++) randomHatch()

                drawScrews(6, 42, 20, 20, 6);
                drawScrews(6, 42, 236, 20, 6);
                break;

        // blue tech metal
        case 12: 
                color = [0.6, 0.6, 1, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 35
                for (var i = 0; i < 10; i++) randomHatch()

                //drawScrews(6, 42, 20, 20, 6);
                //drawScrews(6, 42, 236, 20, 6);
                break;

        // dark wood
        case 13: 
                color = [1.5, 0.6, 0.6, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.4, 0.4, 0.7, 0, 0, 0]
                drawPerlin(33, 255, 0)
                break;

        // light wood
        case 14: 
                color = [0.8, 0.5, 0.6, 1, 60, 40, 40]
                drawPerlin(0, 255, 0)

                color = [0.8, 0.4, 0.4, 0.5, 50, 50, 50]
                drawPerlin(47, 255, 2)
                break;

        // wood
        case 15: 
                color = [0.8, 0.7, 0.7, 1, 60, 40, 40]
                drawPerlin(0, 255, 0)
                break;

        // light concrete
        case 16: 
                color = [1, 1, 1, 1, 55, 60, 50]
                drawPerlin(32, 255, 1)
                break;
            
        // window
        case 17: 
                color = [1, 1, 1, 1, 55, 60, 50]
                drawPerlin(32, 255, 1)

                _seed = 105
                stroke = "#202030"
                lit = "#FFA030"
                drawWindows(20, 20, 45, 60, 30, 40, 5, 4, 0)
                break;

        // yellow fire
        case 18:
                color = [3, 2, 0, 1, 60, 60, -50]
                drawPerlin(0, 255, 1)
                break;

        // red tech metal
        case 19: 
                color = [3, 1, 0.5, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 5832
                for (var i = 0; i < 15; i++) randomHatch()

                break;

        // green tech metal
        case 20: 
                color = [1, 3, 0.8, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 693
                for (var i = 0; i < 12; i++) randomHatch()
                break;


        // yellow tech metal
        case 21: 
                color = [4, 2.5, 0.5, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 81
                for (var i = 0; i < 10; i++) randomHatch()
                break;

        // gray tech metal
        case 22: 
                color = [2, 2, 2.5, 1, 0, 0, 0]
                drawPerlin(0, 255, 0)

                ctx.lineWidth="2";
                stroke="#000000";
                lit="#404040";

                _seed = 176
                for (var i = 0; i < 15; i++) randomHatch()
                break;

        /*
        case 2: drawPerlin(0, 175, 100, 100, 100)
                break;
        case 3: drawPerlin(0, 175, 100, 60, 20)
                break;
        case 4: drawPerlin(0, 150, 20, 40, 0)
                break;
        case 5: drawPerlin(0, 200, 70, 0, 0)
                ctx.strokeStyle="#601010";
                ctx.lineWidth="3";
                drawBricks(ctx)
                break;
        case 6: 
                
                drawPerlin(0, 200, 60, 60, 60)
                ctx.strokeStyle="#303030";
                ctx.lineWidth="3";
                drawBricks()
                break;
        case 7: drawPerlin(0, 200, 0, 70, 0)
                ctx.strokeStyle="#003000";
                ctx.lineWidth="3";
                drawBricks()
                break;
        case 8: drawPerlin(0, 200, 20, 20, 40)
                ctx.strokeStyle="#101015";
                ctx.lineWidth="3";
                drawBricks()
                break;
        case 9: drawPerlin(0, 200, 70, 70, 10)
                ctx.strokeStyle="#101015";
                ctx.lineWidth="3";
                drawBricks(ctx)
                break;
        case 10:drawGradient()
                ctx.strokeStyle="#101015";
                ctx.lineWidth="3";
                drawBricks(ctx)
                break;
        case 11:
                drawPerlin(ctx, 10, 200, 40, 20, 20)
                break;
        */
        default: drawNoise(ctx)
    }

    var textureImgData = tcanvas.toDataURL("image/png");
    var image = new Image()
    image.src = textureImgData

    return image


    // *******************************************************************
    // tools
    //
    function randomHatch() {
        drawHatch(rnd(width+128)-128, rnd(height+128)-128, 40 + rnd(width/2), 40+rnd(height/2))
    }

    function drawHatch(x, y, w, h) {
        ctx.strokeStyle = lit
        drawHatchEl(x+2, y+2, w, h)
        ctx.strokeStyle = stroke
        drawHatchEl(x, y, w, h)
    }
    function drawHatchEl(x, y, w, h) {
        ln(x, y, x+w, y)
        ln(x, y, x, y+h)
        ln(x+w, y, x+w, y+h)
        ln(x, y+h, x+w, y+h)
    }
    
    function drawScrews(r, step, x, y, n) {
        while (n > 0) {
            ctx.lineWidth="3";
            ctx.strokeStyle="#151520";
            circle(x, y, r)

            ctx.lineWidth="2";
            ctx.strokeStyle="#404050";
            circle(x, y, r-3)

            ctx.lineWidth="2";
            ctx.strokeStyle="#606060";
            arc(x, y, r+3, 2, 5.5)

            ctx.lineWidth="2";
            ctx.strokeStyle="#101010";
            arc(x, y, r+3, 5.5, 2)

            n--
            y += step
        }
    }

    function drawBricks() {
        ln(0, height/6, width, height/6)
        ln(0, height/6*2, width, height/6*2)
        ln(0, height/6*3, width, height/6*3)
        ln(0, height/6*4, width, height/6*4)
        ln(0, height/6*5, width, height/6*5)

        ln(width/2, 0, width/2, height/6)
        ln(width/2, height/6*2, width/2, height/6*3)
        ln(width/2, height/6*4, width/2, height/6*5)

        ln(width/4, height/6, width/4, height/6*2)
        ln(width - width/4, height/6, width-width/4, height/6*2)
        ln(width/4, height/6*3, width/4, height/6*4)
        ln(width - width/4, height/6*3, width-width/4, height/6*4)
        ln(width/4, height/6*5, width/4, height)
        ln(width - width/4, height/6*5, width-width/4, height)
    }

    function drawWindows(x, y, dx, dy, w, h, nx, ny, litFactor) {
        for (var i = 0; i < ny; i++) {
            let cx = x
            for (var j = 0; j < nx; j++) {
                if (rndf() < litFactor) {
                    ctx.fillStyle = lit
                } else {
                    ctx.fillStyle = stroke
                }
                ctx.fillRect(cx, y, w, h)
                cx += dx
            }
            y += dy
        }
    }

    function ln(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke(); 
    } 

    function circle(cx, cy, r) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    function arc(cx, cy, r, s, e) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, s, e, false);
        ctx.stroke();
    }

    function drawNoise() {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var r = Math.floor(rndf() * 256)
                var g = Math.floor(rndf() * 256)
                var b = Math.floor(rndf() * 256)
                var rgb = '#' + r.toString(16) + g.toString(16) + b.toString(16)
                pixel(x, y, rgb)
            }
        }
    }

    function pixel(x, y, c) {
        ctx.fillStyle = c
        ctx.fillRect(x, y, 1 ,1)
    }

    function drawGradient() {
      var cxlg=ctx.createLinearGradient(0, 0, width, 0);
      cxlg.addColorStop(0, '#f00');
      cxlg.addColorStop(0.5, '#0f0');
      cxlg.addColorStop(1.0, '#00f');

      ctx.fillStyle = cxlg;
      ctx.fillRect(0,0,width,height);
    }

    function drawPerlin(waterLevel, mountainLevel, mode) {
        var perlin = genPerlin(width*2, waterLevel, mountainLevel)

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (mode != 2 || perlin[x][y] > waterLevel) {
                    pixel(x,y, 'rgba('
                        + (perlin[x][y] * color[0] + color[4]) + ','
                        + (perlin[x][y] * color[1] + color[5]) + ','
                        + (perlin[x][y] * color[2] + color[6]) + ','
                        + color[3] + ')');
                }
                if (mode == 1 && perlin[x][y] <= waterLevel) {
                    pixel(x, y,'rgb(' + color[7] + ',' + color[8] + ',' + color[9] + ')')
                }
            }
        }
    }

    function genPerlin(mapSize, waterLevel, mountainLevel) {
        var offscreen_id = ctx.getImageData(0, 0, width, height);
        var offscreen_pixels = offscreen_id.data;
        var i;
        
        for (var i = 0; i < offscreen_pixels.length; i++) {
            offscreen_pixels[i    ] = 
            offscreen_pixels[i + 1] = 
            offscreen_pixels[i + 2] = Math.floor (rndf() * 128);
            offscreen_pixels[i + 3] = 255;
        }
        
        var rows=0;
        var perlin = new Array(mapSize);
        var curRow = 0;
                    
        for (var j = 0; j < offscreen_pixels.length; j++) {
            if ( j === 0 || j % mapSize === 0 ){
                perlin[rows] = [];
                curRow=rows;
                rows++;
            }
            perlin[curRow].push(offscreen_pixels[j]);
        }
        
        for (var z = 0; z < perlin.length; z++) {
            perlin[0][0] = 0;
            perlin[z][0] = 0;
            perlin[0][z] = 0;
            perlin[perlin.length-1][z] = 0;
            perlin[z][perlin.length-2] = 0;
        }

        var p1,p2,p3,p4,p5,p6,p7,p8,p9;
        for (var x = 0; x < perlin.length; x++) {
            for (var y = 0; y < perlin[x].length; y++) {
            
                if (x-1 > 0 && y-1 > 0) { p1 = perlin[x-1][y-1]; } else { p1 = 0; }
                if (y-1 > 0) { p2 = perlin[x][y-1]; } else { p2 = 0; }
                if (x+1 < perlin.length && y-1 > 0) { p3 = perlin[x+1][y-1]; } else { p3 = 0; }
                if (x-1 > 0) { p4 = perlin[x-1][y]; } else { p4 = 0; }
                if (x+1 < perlin.length) { p5 = perlin[x+1][y]; } else { p5 = 0; }
                if (x-1 > 0 && y+1 < perlin.length) { p6 = perlin[x-1][y+1]; } else { p6 = 0; }
                if (x+1 < perlin.length) { p7 = perlin[x+1][y]; } else { p7 = 0; }
                if (x-1 > 0 && y+1 < perlin.length) { p8 = perlin[x-1][y+1]; } else { p8 = 0; }
                p9 = perlin[x][y];
                
                var avg = parseInt((p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9)/9, 10);
                
                if (avg <= waterLevel) { //water
                    avg = 0;
                }
                if (avg > mountainLevel) { //mountains
                    avg = mountainLevel;
                }
                perlin[x][y] = avg;
            }
        }
        
        var xx, yy;
        for (xx = 1; xx < perlin.length-1; xx++) {
            for (yy = 1; yy < perlin.length-1; yy++) {
                if (perlin[xx-1][yy] === 0 && perlin[xx+1][yy] === 0 && perlin[xx][yy-1] === 0 && perlin[xx][yy+1] === 0) {
                    perlin[xx][yy] = 0;
                }
                if (perlin[xx-1][yy] === 0 && perlin[xx+1][yy] === 0 && perlin[xx][yy-1] === 0 && perlin[xx][yy+1] === 0) {
                    perlin[xx][yy] = 0;
                }
            }
        }

        return perlin
    }

}

function bindLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.generateMipmap(gl.TEXTURE_2D)
    // enable smooth textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // enable pixelated textures
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function defineTexture(texture) {
    _resources++
    texture.image.onload = function () {
        _loaded++
        bindLoadedTexture(texture)
    }
}

function generateMaterials() {
    for (var i = 0; i < 25; i++) {
        var texture = gl.createTexture();
        texture.image = generateMaterial(i)
        material[i] = texture
        defineTexture(texture)
    }
}

function loadTexture(url) {
    // create and bind
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // fill the texture with a 1x1 blue pixel
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));

    // load image
    texture.image = new Image()

    texture.image.onload = function() {
        bindLoadedTexture(texture)
    }
    texture.image.src = url

    return texture
}

