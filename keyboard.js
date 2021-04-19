var keys = {};

function handleKeyDown(e) {
    let code = e.which || e.keyCode
    keys[code] = true;
    if (code != 8 && code != 9 && code != 80) env.lastControl = 0
    e.preventDefault()
    e.stopPropagation()
    return false;
}

function execute(cmd) {
    switch(cmd) {
        case 'godmode':
            env.god = true
            break
    }
}

let commandInput = false
function handleCommand(e) {
    if (e.code === 'Enter') {
        execute(env.trace.substring(1))
        commandInput = false
        env.trace = ''
    } else if (e.code === 'Backspace') {
        env.trace = '\\'
    } else if (e.key.length === 1) {
        env.trace += e.key
    }
}

let nextSfx = 0
function handleKeyUp(e) {
    var code = e.which || e.keyCode
    keys[code] = false;

    // global handling
    if (env.pause && code != 8 && code != 9 && code != 81 && code != 18) {
        env.pause = false
        return false
    }

    if (commandInput) {
        handleCommand(e)
        return false
    }

    switch(code) {
    case 27:
        // ESC - new level
        levelup()
        break;
    case 79:
    case 112:
        // F1/O - Rolling Demo
        startDemo()
        break;
    case 113:
        // F2 - show/hide overlay tab
        env.overlay = !env.overlay
        overlay.style.display = "initial"
        break;
    case 115:
        // DEBUG F4 - spawn more lost drones
        spawnDrone(0)
        break;
    case 116:
        // DEBUG F5 - spawn more drones
        spawnDrone(1 + rndi(4))
        break;
    case 123:
        // DEBUG F12 - upgrade cheat
        target.upgrade()
        break;
    case 81:
        // Q - attach/detach controls
        if (focus) focus = false
        else if (target && target.type == 1 && target.alive) focus = target
        break;
    case 8:
        // Break - previous drone
        if (env.demo || keys[18]) targetNext(-1)
        else targetNext(-1, target.team)
        break;
    case 9:
        // TAB - attach camera to the next drone
        if (env.demo || keys[18]) targetNext()
        else targetNext(1, target.team)
        break;
    case 80:
        env.pause = true
        break;
    case 220:
        commandInput = true
        env.trace = '\\'
        break;
    }
    e.preventDefault()
    e.stopPropagation()
    return false;
}

function handleMouse(e) {
    e.preventDefault()
    e.stopPropagation()
    return false;
}

function handleKeyboard(delta) {
}
