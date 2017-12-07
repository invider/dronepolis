
function placeUnits() {
    silent = true
    _seed = env.level * 7181
    // place player
    var player = spawnDrone(1)

    // additional drones
    let n = scaleLinear(10, env.level, 2, 20)
    for (var i = 0; i < n; i++)
        for (var t = 1; t < 5; t++) spawnDrone(t)

    for (i = 0; i < grid.width*2; i++) spawnPod()

    silent = false
    focus = player
    target = player
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
            (stat.lostSpawned >= env.totalToSpawn  // we have spawned everybody
            && stat.units(0, 1) == 0)  // no more lost souls
                || stat.enemies(0) == 0
                || stat.enemies(1) == 0
                || stat.enemies(2) == 0
                || stat.enemies(3) == 0
                || stat.enemies(4) == 0
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
    return -1
}

function setupLevel() {
    env.totalToSpawn = scaleLinear(30, env.level, 10, 200)
    env.maxDronesOnLevel = scaleLinear(100, env.level, 10, 250)
    env.levelCountdown = 0
    Drone._spawn = 0

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
        enemies: function(team) {
            let i = 0
            entities.forEach( function(e) {
                if (e.type == 1 && e.team != team && e.team != 0 && e.alive) i++
            })
            return i
        },
    }
}
