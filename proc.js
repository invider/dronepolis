'use strict'

/*
 * Procedural textures generators
 */
function generateTerminalImage(type, frame, lines) {
    var width = 256
    var height = 256
    var tcanvas = document.createElement("canvas");

    tcanvas.width = width
    tcanvas.height = height
    var context = tcanvas.getContext("2d");

    drawFrame(context, type, frame, lines)

    var textureImgData = tcanvas.toDataURL("image/png");
    var image = new Image()
    image.src = textureImgData

    return image

    function drawFrame(ctx, type, frame, lines){
        ctx.fillStyle="#000000"
        ctx.globalAlpha = 0.6
        ctx.fillRect(0,0,width,height); 
        ctx.globalAlpha = 1

        var cl = '#888888'
        switch(type) {
        case 0: cl ='#00E0FF'; break;
        case 1: cl ='#FF0020'; break;
        case 2: cl ='#20FF00'; break;
        case 3: cl ='#FFFF00'; break;
        case 4: cl ='#FFFFFF'; break;
        }

        // text
        var vsh = 17
        ctx.fillStyle = cl
        ctx.font="17px 'Lucida Console', Monaco, monospace";

        while (vsh < height) {
            if (frame >= lines.length) frame = 0;
            ctx.fillText(lines[frame++],20,vsh); 
            vsh += 18
        }

        scanlines(ctx)

        // outer frame
        ctx.strokeStyle=cl
        ctx.lineWidth="4";
        ln(ctx, 0, 0, width, 0)
        ln(ctx, 0, 0, 0, height)
        ln(ctx, width, 0, width, height)
        ln(ctx, 0, height, width, height)
    }

    function scanlines(ctx) {
        context.lineWidth="2";
        context.strokeStyle = "rgba(0, 0, 0, 0.7)";
        for (var i = 0; i < height/4; i++) {
            ln(ctx, 0, i*4, width, i*4)
        }
    }

    function ln(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke(); 
    }
}

function corev() {
    return (0x1000 + randi(0xEFFF)).toString(16).toUpperCase() + ' '
}
function coreDumpLine() {
    return corev() + corev() + corev() + corev()
}

var virusData = [
        ' ', '#', '$', '/', '\\', '^', '!', '~',
        '%', '@', '*', '0', 'F', 'A', '[', ']',
        '|', '<', '>', '.', 'Z', 'X'
]
function virusv() {
    return virusData[randi(virusData.length)]
}
function virusLine() {
    var res = ''
    for (var i = 0; i < 21; i++) {
        res += virusv()
    }
    return res
}

function generateTextures() {
    var lines

    for (var type = 0; type < 5; type++) {

        switch(type) {
        case 1: lines = []
            for (var i = 0; i < 15; i++) {
                lines.push(virusLine())
            }
            break;
        case 2: lines = [
                "===  CORE DUMP  ===",
                ]
            for (var i = 0; i < 14; i++) {
                lines.push(coreDumpLine())
            }
            break;
        case 3: lines = [
                "/* GRID SUPERVISOR */",
                "#include <core/irq.h>",
                "#include <kernel.h>",
                "extern struct hw_irq",
                "#define IRQ_DISABLED 2",
                "#define IRQ_PENDING  4",
                "unsigned int flags = 7;",
                "current->priority = 0;",
                "for(;;) {",
                "    if(work) _idle = 1;",
                "    if(intr) break;",
                "}",
                "current->state = HALT;",
                "unlock_core();",
                "queue(SIGKILL);",
                "return -9;",
                ]
                break;
        default: lines = [
                "07BF0: ADD AX, DX",
                "07BF1: INC AX",
                "07BF2: CAD AX, DX",
                "07BF3: LDF AX, DX",
                "07BF4: LDU AX, DX",
                "07BF5: LDC AX, DX",
                "07BF7: JMP 0FFA4",
                "07BF8: LDF AX, DX",
                "07BF9: LDQ AX, DX",
                "07BFA: LDQ AX, DX",
                "07BFB: LDQ AX, DX",
                "07BFC: LDQ AX, DX",
                "07BFD: LDQ AX, DX",
                "#HALT AND CATCH FIRE#",
            ]
        }
        
        textureSets[type] = []
        for (var i = 0; i < lines.length; i++) {
            textureSets[type].push(createTexture(type, i, lines))
        }
    }
}

