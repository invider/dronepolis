var gl;

// fine tuning
CULLING = 60
SPAWN_RATE = 0.5
ROLLING_DEMO_TIME = 30

// resources
_resources = 0
_loaded = 0
material = []
textureSets = []

// env
env = {
    pause: false,
    level: 0,
    gameTime: 0,
    levelTime: 0,
    lastControl: 0,
    levelCountdown: 0,
    overlay: false,
    overlayData: false,
    status: 'none',
    message: '',
    messageTime: 0,
}

// entities
entities = []
markers = []

// camera
var focus = false
var target = false
var pMatrix = mat4.create()

// transformations stack
var mvMatrix = mat4.create()
var mvMatrixStack = []

// normal
var nMatrix = mat4.create()

var lastTime = Date.now()
var shaderProgram;

function message(msg, time) {
    env.message = msg
    if (!time) time = 3
    env.messageTime = time
}

function levelup() {
    env.level ++
    entities = []
    grid = new Grid(env.level) // map for the level
    setupLevel()
    placeUnits()
    message('Zone ' + env.level, 7)
}

function start() {
    levelup()
    lastTime = Date.now()
}

function findPrevEntityIndex(predicate, startIndex) {
    let eindex = -1
    if (!startIndex || startIndex >= entities.length) startIndex = entities.length-1

    for (let i = startIndex; i >= 0 && eindex < 0; i--) {
        if (predicate(entities[i])) eindex = i
    }
    if (eindex < 0) {
        // start from the end
        for (i = entities.length-1; i >= 0 && eindex < 0; i--) {
            if (predicate(entities[i])) eindex = i
        }
    }
    return eindex
}

function findEntityIndex(predicate, startIndex) {
    let eindex = -1
    if (!startIndex || startIndex < 0) startIndex = 0

    for (let i = startIndex? startIndex:0; i < entities.length && eindex < 0; i++) {
        if (predicate(entities[i])) eindex = i
    }
    if (eindex < 0) {
        // start from the beginning
        for (i = 0; i < entities.length && eindex < 0; i++) {
            if (predicate(entities[i])) eindex = i
        }
    }

    return eindex
}

function findEntity(predicate, startIndex, dir) {
    var i = -1
    if (dir < 0) i = findPrevEntityIndex(predicate, startIndex)
    else i = findEntityIndex(predicate, startIndex)
    if (i < 0) return null
    return entities[i]
}

function targetNext(jump, team) {
    let i = entities.indexOf(target)
    if (jump) i += jump
    else i++

    var e = false
    if (team) {
        e = findEntity( function(t) {
            if (t.alive && t.type == 1 && t.team == team) return true
            return false
        }, i, jump)
    } else {
        e = findEntity( function(t) {
            if (t.alive && t.type == 1) return true
            return false
        }, i, jump)
    }

    if (e) {
        // found new drone to jump in
        target = e // attach camera
        if (focus) focus = target // attach controls if needed
        env.targetTime = 5 + rndi(10)
    }
    return e
}

function spawn(cons, x, y, z) {
    var entity = new cons()
    entity.init(x, y, z)

    var placed = false
    for (var i = 0; i < entities.length; i++) {
        if (!entities[i].alive) {
            entities[i] = entity
            placed = true
            break
        }
    }
    if (!placed) entities.push(entity)
    return entity
}

function spawnDrone(team) {
    let coord = grid.freeSpot(team)
    let e = findEntity( function(e) {
        return (dist(e.x, e.z, coord[0], coord[1]) < 5) && e.type < 3
    })
    // make sure the player doesn't see respawn
    let camDist = 60
    if (target) camDist = floor(dist(target.x, target.y, coord[0], coord[1]))

    // if not occupied and far from the camera
    if (!e && (team || camDist > 40)) {
        //console.log('spawning +1 drone @' + coord[0] + 'x' + coord[1] + ' camDist:' + camDist)
        let d = spawn(Drone, coord[0], -0.5, coord[1])
        d.yaw = rndfi()
        if (team) d.assignTeam(team)
        if (team == 0) stat.lostSpawned ++
        sfx(10,1)
        return d
    } else {
        // try again
        return spawnDrone(team)
    }
}

function spawnPod(power) {
    let coord = grid.freeSpot()
    let e = findEntity( function(e) {
        return (dist(e.x, e.z, coord[0], coord[1]) < 2) && e.type < 3
    })
    if (!e) {
        let p = spawn(Pod, coord[0], -0.5, coord[1])
        if (power) p.power = power
        return p
    }
}

function cycle() {
    var now = Date.now()
    var delta = (now - lastTime)/1000

    //setTimeout(cycle, 17)
    window.requestAnimFrame(cycle);

    try {
        handleKeyboard(delta);
        render(delta);
        if (delta > 0.3) delta = 0.3
        while (delta > 0.05) {
            evo(0.05)
            delta -= 0.05
        }
        evo(delta);
    } catch (e) {
        console.log(e)
    }

    lastTime = now
    env.cycle = Date.now() - now
}

function startDemo() {
    env.demo = true
    env.targetTime = 7
    focus = false
    env.lastControl = ROLLING_DEMO_TIME+1
}

function evo(delta) {
    if (env.pause) return
    env.gameTime += delta
    env.levelTime += delta
    env.lastControl += delta
    env.messageTime -= delta

    if (env.levelCountdown > 0) {
        env.levelCountdown -= delta
        if (env.levelCountdown <= 0) {
            levelup()
        }
    }

    if (!target) targetNext()
    if (!target.alive) {
        if (target.ghostTime > 0) {
            target.ghostTime -= delta
            target.mevo(delta)
        } else {
            let e = targetNext(1, target.team)
            if (e == null) {
                targetNext()
                startDemo()
            }
        }
    }
    if (env.demo) {
        env.targetTime -= delta
        if (env.targetTime < 0) {
            // find next target
            targetNext()
        }
        if (env.lastControl < ROLLING_DEMO_TIME) {
            env.demo = false
            focus = target
        }
    } else if (env.lastControl > ROLLING_DEMO_TIME) {
        startDemo()
    }

    markers.map( function(m) {
        m.evo(delta)
    })
    entities.map( function(e) {
        if (e.alive) e.evo(delta)
    })
    // collision detection
    entities.map( function(e) {
        if (e.alive && e.collide) {
            grid.collide(e, delta)
            entities.map( function(t) {
                if (e != t && t.alive) {
                    e.collide(t, delta)
                }
            })
        }
    })

    // spawn more lost drones
    if (rndf() < SPAWN_RATE * delta) {
        if ((stat.units(-1, 1) < env.maxDronesOnLevel)
                && stat.lostSpawned < env.totalToSpawn) {
            spawnDrone(0)
        }
    }

    // maybe level is over?
    if (env.levelCountdown == 0) {
        let winner = tryLevelUp()
        if (winner > 0) {
            // we have the winner!
            message('ZONE ' + env.level + ' COMPLETED'
                    + '<hr>' + teamName(winner) + ' Team Wins!', 7)
            env.levelCountdown = 8
        }
    }
}

function render(delta) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (_loaded !== _resources || !shaderProgram) return

    // set perspective view
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    // reset camera matrix
    mat4.identity(mvMatrix);

    // move to camera view - pitch, yaw, translate
    if (target) {
        let t = target
        /*
        // object camera view translation
        mat4.rotate(mvMatrix, 0.1, [1, 0, 0]);
        mat4.translate(mvMatrix, [0, -1, -2.5]);
        // camera object translation
        mat4.rotate(mvMatrix, -t.pitch, [1, 0, 0]);
        mat4.rotate(mvMatrix, -t.yaw, [0, 1, 0]);
        mat4.rotate(mvMatrix, -t.roll, [0, 0, 1]);
        mat4.translate(mvMatrix, [t.x, t.y, t.z]);
        */
        // object camera view translation
        mat4.rotate(pMatrix, 0.1, [1, 0, 0]);
        mat4.translate(pMatrix, [0, -1, -2.5]);
        // camera object translation
        mat4.rotate(pMatrix, -t.pitch, [1, 0, 0]);
        mat4.rotate(pMatrix, -t.yaw, [0, 1, 0]);
        mat4.rotate(pMatrix, -t.roll, [0, 0, 1]);
        mat4.translate(pMatrix, [t.x, t.y, t.z]);
    } else {
        mat4.rotate(pMatrix, 0, [1, 0, 0]);
        mat4.rotate(pMatrix, 0, [0, 1, 0]);
        mat4.translate(pMatrix, [0, 0, 0]);
    }
    setMatrixUniforms()

    // render grid - markers - entities
    env.modelsCount = 0

    grid.render()
    markers.map( function(m) {
        env.modelsCount++
        m.render()
    })
    entities.map( function(e) {
        if (e.alive) {
            if (Math.sqrt((target.x-e.x)*(target.x-e.x) + (target.z-e.z)*(target.z-e.z)) < CULLING) {
                env.modelsCount++
                e.render(delta)
            }
        }
    })

    // reset camera matrix
    mat4.identity(mvMatrix);

	//gl.clearColor(1, 1, 1, 1);
	//gl.colorMask(false, false, false, true);
	//gl.clear(gl.COLOR_BUFFER_BIT);
    
    /*
    // draw radar
    // Why is it running slow in Chrome?
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //ctx.fillStyle = "#FF0000"
    ctx.fillStyle = "red"
    ctx.font = '20pt Calibri';
    ctx.fillText("Time: " + floor(env.gameTime), 10, 30);
    ctx.fillText("Status: " + env.status, 10, 60);
    ctx.fillText("Res: " + _loaded + '/' + _resources, 10, 90);
    ctx.fillText("FPS: " + Math.round(1/delta), 10, 120);
    ctx.fillText("Cycle: " + env.cycle, 10, 150);
    */

    // material check
    // if (material[1]) ctx.drawImage(material[5].image, 100, 100)

    /*
    if (target) {
        let orig = vec3.set([target.x, target.y, target.z], vec3.create())
        let tar = vec3.set([0, 0, 0], vec3.create())
        let dist = vec3.length(vec3.subtract(orig, tar, vec3.create()))
        dist = vec3.length(orig)
        env.status = 'D:' + Math.round(dist)
    }
    */

    // update overlay
    if (env.messageTime > 0) {
        messageBar.innerHTML = env.message
    } else {
        messageBar.innerHTML = ''
    }

    if (target) {
        statusBar.innerHTML = ''
            + '<font color="#A0A0D0">Lost: '
                + stat.units(0, 1)
                + '/' + (env.totalToSpawn-stat.lostSpawned) + '</font>'

            + '&nbsp&nbsp<font color="#40FF20"> Green: ' + stat.units(1, 1) + '</font>'
            + '&nbsp&nbsp<font color="#FF5020"> Red: ' + stat.units(2, 1) + '</font>'
            + '&nbsp&nbsp<font color="#5020FF"> Blue: ' + stat.units(3, 1) + '</font>'
            + '&nbsp&nbsp<font color="#FFD000"> Yellow: ' + stat.units(4, 1) + '</font>'
            + (env.pause? '<br>(GAME PAUSED) ' : '')
            + (env.demo? '<br>(DEMO MODE) ' : '')
    }
    if (target && env.overlay) {
        overlay.innerHTML = 
           (focus? 'Controlling ' : '')
            + target
            + ' @' + grid.gloc(target.x) + 'x' + grid.gloc(target.z)
            + "<br>" + floor(target.x*100)/100
            + " -- " + floor(target.z*100)/100
            + " -- " + floor(target.y*100)/100
            + '<br>Shield: ' + target.shield
            + '<br>Speed: ' + floor(target.speed)
            + (focus? ''
                : ('<hr>Goal: ' + target.goal
                + (target.tar? '<br>Target: '
                        + target.tar + ' @' + Math.round(target.dist(target.tar)) + 'm' :'')
                + '<br>Action: ' + target.action + '[' + floor(target.actionTime) + ']'
                + '<br>Move: ' + target.move + '[' + floor(target.moveTime) + ']')
            )
            + '<br>Drones: ' + stat.units(-1, 1)
            + '<br>Status: ' + env.status
            + '<hr>FPS: ' + Math.round(1/delta)
    } else if (target) {
        overlay.innerHTML = ''
            + target
            + '<br>Shield: ' + target.shield + '/' + target.MAX_SHIELD
    }
}
