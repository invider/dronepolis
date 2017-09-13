
function scaleLinear(base, val, scale, max) {
    if (max) return limitMax(base + val*scale, max)
    else return base + val*scale
}

function downLinear(base, val, scale, min) {
    return limitMin(base - val*scale, min)
}

function placeUnits() {
    silent = true
    _seed = env.level * 7181
    // place player
    var player = spawnDrone(1)
    focus = player
    target = player

    // help the player with initial bots
    if (env.level == 1) spawnDrone(1)
    if (env.level < 5) spawnDrone(1)


    // additional drones
    let n = floor(scaleLinear(0, env.level, 0.5, 20)) + 1
    for (var i = 0; i < n; i++) {
        spawnDrone(2)
        spawnDrone(3)
        spawnDrone(4)
    }

    for (i = 0; i < grid.width*2; i++) spawnPod()
    silent = false
}

function teamName(n) {
    switch(n) {
    case 1: return 'Green';
    case 2: return 'Red';
    case 3: return 'Blue';
    case 4: return 'Yellow';
    default: return 'Lost';
    }
}

function tryLevelUp() {
    if (
            stat.lostSpawned >= env.totalToSpawn  // we have spawned everybody
            && stat.units(0, 1) == 0  // no more lost souls
       ) {
        // level is over! determine who is the winner
        let winner = 0
        let bestScore = 0

        for (let i = 1; i < 5; i++) {
            let teamScore = stat.units(i, 1)
            if (teamScore > bestScore) {
                winner = i
                bestScore = teamScore
            }
        }
        return winner
    }
    return 0
}

function setupLevel() {
    env.totalToSpawn = scaleLinear(40, env.level, 5, 200)
    env.maxDronesOnLevel = scaleLinear(40, env.level, 10, 100)

    // reinitialize stat
    stat = {
        lostSpawned: 0,
        found: [0, 0, 0, 0, 0],
        playerFound: [0, 0, 0, 0 , 0],
        kills: [0, 0, 0, 0, 0],
        playerKills: [0, 0, 0, 0, 0],
        lost: [0, 0, 0, 0, 0],
        playerLost: [0, 0, 0, 0, 0],

        units: function(team, type) {
            let i = 0
            if (team < 0) {
                entities.forEach( function(e) {
                    if (e.type == type && e.alive) i++
                })
            } else {
                entities.forEach( function(e) {
                    if (e.type == type && e.team == team && e.alive) i++
                })
            }
            return i
        },
    }
}
