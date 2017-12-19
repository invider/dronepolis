"use strict"

let Drone = function() {
    this.type = 1
    this._serial = ++Drone._spawn
    this.mk = 1
    this.name = "Drone " + this._serial
    this.team = 0
    this.goal = 0
    this.tar = false
    this.action = 0
    this.actionTime = 0
    this.move = 0
    this.moveTime = 0
    
    augment(this, _Actor)

    // tunning
    this.radius = 0.3
    this.scale = [.2,.2,.2]
    this.MAX_SPEED = 4
    this.THRUST = 5
    this.FRICTION = 7

    this.MAX_DYAW = 1
    this.TYAW = 0.8
    this.FYAW = 0.9
    this.CYAW = 0.5
    this.CROLL = 0.5
    this.CPITCH = 0.1

    this.MAX_SHIELD = 100
    this.POWER = 10
    this.RECOIL_TIME = .3
    this.OVERHEAT_RATE = .06
    this.COOLING_RATE = .1

    this.HOVER = -this.radius * 1.5 // oscilation median
    this.HOVER_CORRIDOR = this.radius/2 // oscilation corridor
    this.HOVER_BOTTOM = -this.radius * 1.2 // keep on velocity
    this.OSC_ACCELERATION = 0.1
    this.MAX_DY  = 20

    // state
    this.mass = 1
    this.speed = 0
    this.dyaw = 0
    this.shield = this.MAX_SHIELD
    this.recoil = 0
    this.overheat = 0
    this.dy = 0
    this.odir = 1
    this.lastCollision = 0
    this.lastCollider = false

    this.assignTeam = function(t) {
        this.team = t
        this.goal = 0
        this.action = 0
        this.target = false
        this.MAX_SPEED *= 2
        this.adjustTexture()
    }

    this.upgrade = function() {
        if (this.mk > 29) {
            if (target == this) {
                message("Can't install more upgrades", 3)
            }
            return false
        }
        this.mk++
        this.mass++

        let up = rndi(7)
        let msg = ''

        switch(up) {
        case 0:
            this.MAX_SPEED *= 1.2
            msg = "Drone speed upgraded +20%"
            break;
        case 1:
            this.MAX_SHIELD *= 1.2
            msg = "Drone speed upgraded +20%"
            break;
        case 2:
            this.THRUST *= 1.2
            msg = "Drone acceleration upgraded +20%"
            break;
        case 3:
            this.RECOIL_TIME *= 0.9
            msg = "Drone fire speed upgraded +10%"
            break;
        case 4:
            this.POWER *= 1.2
            msg = "Laser power upgraded +20%"
            break;
        case 5:
            this.OVERHEAT_RATE *= 0.9
            msg = "Laser heating reduced -10%"
            break;
        case 6:
            this.COOLING *= 1.2
            msg = "Laser cooling system upgraded +20%"
            break;
        }
        if (target == this) {
            message(msg, 3)
        }

        return true
    }

    this.adjustTexture = function() {
        switch (this.team) {
            case 0:
                this.model.dirLight = [0.5, 0.5, 0.5];
                this.model.texture = material[22]; break;
            case 1:
                this.model.dirLight = [0.5, 0.5, 1];
                this.model.texture = material[20]; break;
            case 2:
                this.model.dirLight = [0.5, 0.5, 0.5];
                this.model.texture = material[19]; break;
            case 3:
                this.model.dirLight = [0.5, 0.5, 0.5];
                this.model.texture = material[12]; break;
            case 4:
                this.model.dirLight = [0.5, 0.5, 0.5];
                this.model.texture = material[21]; break;
        }
    }

    this.ctrl = function(c, delta) {
        switch (c) {
        case 1:
            // forward thrust
            this.thrust = true
            this.speed += this.THRUST * delta
            if (this.speed > this.MAX_SPEED) this.speed = this.MAX_SPEED
            break
        case 2:
            // left turn
            this.turn = true
            this.dyaw += this.TYAW * delta
            if (this.dyaw > this.MAX_DYAW) this.dyaw = this.MAX_DYAW
            break
        case 3:
            // right turn
            this.turn = true
            this.dyaw -= this.TYAW * delta
            if (this.dyaw < -this.MAX_DYAW) this.dyaw = -this.MAX_DYAW
            break
        case 4:
            // backward thrust
            this.thrust = true
            this.speed -= this.THRUST * delta
            if (this.speed < -this.MAX_SPEED) this.speed = -this.MAX_SPEED
            break
        case 5:
            // shoot
            if (this.recoil <= 0 && this.overheat < 1) {
                let l = spawn(Laser, this.x, this.y+0.05, this.z)
                this.recoil = this.RECOIL_TIME
                this.overheat += this.OVERHEAT_RATE
                l.join(this, this.overheat)
                if (this.speed > 0) l.speed += this.speed
            }
            break;
        }
    }

    this.noctrl = function(delta) {
        if (!this.thrust) {
            // no thrust
            if (this.speed > 0) {
                this.speed -= this.FRICTION * delta
                if (this.speed < 0) this.speed = 0
            } else if (this.speed < 0) {
                this.speed += this.FRICTION * delta
                if (this.speed > 0) this.speed = 0
            }
        }
        if (!this.turn) {
            // no turn
            if (this.dyaw > 0) {
                this.dyaw -= this.FYAW * delta
                if (this.dyaw < 0) this.dyaw = 0
            } else if (this.dyaw < 0) {
                this.dyaw += this.FYAW * delta
                if (this.dyaw > 0) this.dyaw = 0
            }
        }
    }

    this.infect = function(t) {
        if (this.team > 0 || t.team == 0 || abs(this.speed) > abs(t.speed)) return
        this.assignTeam(t.team)
        stat.found[t.team] ++
        if (t == focus) stat.playerFound[t.team] ++
        if (this.team == target.team) {
            message('New Lost Drone joined out team!', 3)
        }
        sfx(7, 1, this)
    }

    this.hit = function(t) {
        switch(t.type) {
        case 1:
            // drones - find who is managing the collision by serial number
            if (this._serial < t._serial) {
                if (env.gameTime - this.lastCollision < 0.5
                        && this.lastCollider == t) return

                this.lastCollision = env.gameTime
                this.lastCollider = t

                this.rewind()
                this.speed = -this.speed
                if (this.speed == 0) this.speed = rnds() * this.MAX_SPEED
                t.rewind()
                t.speed = -t.speed
                if (t.speed == 0) t.speed = rnds() * t.MAX_SPEED

                if (t.action != 1) {
                    t.action = 1
                    t.actionTime = 1 + rndi(2)
                }
                if (this.action != 1) {
                    this.action = 1
                    this.actionTime = 1 + rndi(2)
                }
                if (this == target || t == target) sfx(5, 1)
            }
            this.infect(t)
            break;
        }
    }

    // = bot =
    this.selectGoal = function() {
    }

    this.selectTarget = function() {
        // find target
        let bot = this

        // find alive drone nearby
        var potentialTargets = entities.filter( function(e) {
            return e.alive && e.type < 3 && e.team != bot.team && e.dist(bot) < 20
        })

        if (potentialTargets.length > 0) {
            this.tar = potentialTargets[0]
        } else {
            this.tar = false
        }
        return this.tar
    }

    this.angleOnTarget = function() {
        if (!this.tar) return 0
        return normAngle(normAngle(this.yaw)-this.dir(this.tar))
    }

    this.angleOn = function(e) {
        return normAngle(normAngle(this.yaw)-this.dir(e))
    }

    this.wonder = function(delta) {
        if (this.moveTime <= 0) {
            // next one
            this.move = 1 + rndi(3)
            this.moveTime = 1 + rndi(5)
        }
        this.ctrl(this.move, delta)
    }

    this.explore = function(delta) {
        if (this.actionTime <= 0) this.action = 0 // find something else to do
        if (this.moveTime < 0) {
            this.move = 1 + rndi(3)
            this.moveTime = 5 + rndi(10)
        }
        this.ctrl(this.move, delta)
    }

    this.followTarget = function(delta) {
        if (!this.tar || !this.tar.alive) {
            if (!this.selectTarget()) {
                // can't find a target - explore
                this.action = 3
            }
            return
        }

        let dist = this.tar.dist(this)
        if (dist > 40) {
            // find something closer
            this.action = 0
            this.tar = false
            return
        }

        let dir = this.angleOnTarget()
        let adir = Math.abs(dir)

        if (adir < 0.03) {
            // we are on target
            if (this.tar.type == 1 && this.tar.team != this.team && this.tar.team != 0) {
                // rush forward
                if (dist < 4) this.ctrl(4, delta)
                else if (dist > 7) this.ctrl(1, delta)
                // shoot!
                this.ctrl(5, delta)
            } else if (this.tar.type == 1 && this.tar.team == 0
                    || this.tar.type == 2) {
                // ram!
                this.ctrl(1, delta)
            } else {
                this.tar = false
                this.action = 0
            }
        } else if (adir > 2.5) {
            // just left on high angles
            this.ctrl(2, delta)
        } else if (dir < 0) {
            this.ctrl(2, delta)
            if (dist < 4) this.ctrl(4, delta)
            else if (dist > 8) this.ctrl(1, delta)
        } else if (dir > 0) {
            this.ctrl(3, delta)
            if (dist < 4) this.ctrl(4, delta)
            else if (dist > 8) this.ctrl(1, delta)
        }
    }

    this.mevo = function(delta) {
        this.x += Math.sin(this.yaw) * this.speed * delta
        this.z += Math.cos(this.yaw) * this.speed * delta
    }

    this.evo = function(delta) {
        this.snap()

        this.thrust = false
        this.turn = false

        if (this == focus) {
            if (keys[38] || keys[87]) this.ctrl(1, delta) // forward
            else if (keys[40] || keys[83]) this.ctrl(4, delta) // backward

            if (keys[37] || keys[65]) this.ctrl(2, delta); // left
            else if (keys[39] || keys[68]) this.ctrl(3, delta); // right

            if (keys[32] || keys[16] || keys[69]) this.ctrl(5)
        } else {
            // === AI bot control ===

            // action determines current moves
            this.moveTime -= delta
            this.actionTime -= delta
            switch(this.action) {
            case 0:
                // no action - look for something new to do according to our goal
                if (this.team == 0) {
                    this.action = 2
                    this.actionTime = 0
                } else {
                    this.action = 4 // look for some target
                    this.actionTime = 10+rndi(20)
                }
                break;
            case 1:
                // wait
                if (this.actionTime <= 0) this.action = 0
                break;
            case 2:
                // lost
                this.wonder(delta)
                break;
            case 3:
                // explore
                this.explore(delta)
                break;
            case 4:
                // follow and attack
                this.followTarget(delta)
                break;
            case 4:
                // follow the target
                break;
            case 5:
                // look for
                break;
            }
        }
        this.noctrl(delta)

        // oscilations
        if (this.speed == 0) {
            if (this.y > this.HOVER - this.HOVER_CORRIDOR) this.odir = -1
            else if (this.y < this.HOVER + this.HOVER_CORRIDOR) this.odir = 1
            this.dy += this.odir * this.OSC_ACCELERATION * delta
        } else if (this.speed > 0) {
            if (this.y < this.HOVER_BOTTOM) {
                this.odir = 1
                this.dy += this.odir * this.OSC_ACCELERATION  * delta
            } else this.dy = 0
        } else if (this.speed < 0) {
            if (this.y > this.HOVER - this.HOVER_CORRIDOR) {
                this.odir = -1
                this.dy += this.odir * this.OSC_ACCELERATION  * delta
            } else this.dy = 0
        }
        this.dy = limitRange(this.dy, -this.MAX_DY, this.MAX_DY)

        this.recoil -= delta
        this.overheat = limitMin(this.overheat - this.COOLING_RATE*delta, 0)
        this.yaw += this.dyaw * delta

        this.snap() // store current xyz for future rewind if necessary
        this.mevo(delta)
        this.y += this.dy * delta

        if (!grid.free(this.x, this.z, this.radius*1.2)) {
            // collision - hit the wall!
            this.rewind() // restore previous coordinates
            this.speed = -this.speed
            this.move = 0
            this.moveTime = 0
            this.action = 3 // pick some new action
            if (target == this) sfx(6, 0.3)
        }

        // ground safeguard
        this.y = limitMax(this.y, -this.radius)
        
        if (this.shield <= 0) this.kill()

        // debug turn
        //this.model.evo(delta)
    }

    this.model = new Octa(4, 0.5, 2, 1, material[16])
    this.model.z = -1.25
    this.model.bind()
    this.adjustTexture()

    this.render = function() {
        // rotate and translate
        mvPushMatrix()
        mat4.translate(mvMatrix, [-this.x, -this.y, -this.z]);
        mat4.scale(mvMatrix, this.scale);
        mat4.rotate(mvMatrix, this.yaw + (this.CYAW * this.dyaw), [0, 1, 0]);
        mat4.rotate(mvMatrix, this.roll + (this.CROLL * this.dyaw), [0, 0, 1]);
        mat4.rotate(mvMatrix, this.pitch, [1, 0, 0]);

        this.model.render();

        // back to original transformation
        mvPopMatrix()
    }
    
    this.kill = function(src) {
        this.alive = false

        // spoils
        let n = this.mass + rndi(3)
        for (let i = 0; i < n; i++) {
            let p = spawn(Pod, this.x, this.y, this.z)
            p.drift()
        }

        stat.lost[this.team]++
        if (this == focus) {
            this.speed = -1
            this.ghostTime = 5
            stat.playerLost[this.team] ++
        }
        // reward the killer
        if (src) {
            stat.kills[src.team]++
            if (src == focus) stat.playerKills[src.team] ++
        }
        sfx(2, 1, this)
    }

    this.toString = function() {
        return this.name + ' MK' + this.mk + ' [' + this.team + ']'
    }
}
