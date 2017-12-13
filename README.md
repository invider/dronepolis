# City of Lost Drones

js13k compo entry

## Controls

* WASD/Cursor keys - move around
* Space/Shift/E - shoot
* Q - pass control of current drone to AI
* Tab/Backspace - jump into next/previous drone of your team (or any drone in Demo mode)
* P - pause
* F1/O - enable Demo mode
* F2   - show debug info
* F4   - spawn new lost drone
* F5   - spawn a drone to join random team
* F12  - upgrade drone

Trick - in Demo mode you can jump into drone of any team. Once you take control over it - you are playing for that team!


## Things left to do that haven't got into compo version
- [ ] stop bots colliding into the walls over and over again
- [ ] stop bots trying to fire at each other through the walls
- [ ] make bots better maze explorers
- [ ] bots should target faster
- [ ] bots should start dodging when fired upon
- [ ] make more physically accurate drone collisions
- [ ] fix killed-by-the-wall type of collisions
- [ ] make bots more aggressive (they should attack instead of collecting pods when enemies are around)
- [ ] explosions
- [ ] introduce penalty for hitting walls or drones?
- [ ] update sfx
- [ ] hot-seat mode
- [X] fix unlimited shields bug
- [X] fix levelup bug
- [X] introduce laser overheat


## How to build minimized version

### Building Toolchain

Note: npm should be installed to obtain the toolchain

Run ./install-toolchain

Run ./build

If gulp got frozen, it usually happens when obsolete version of nodejs is used - upgrade to at least 8.4.0

The generated game archive and js/html files are located in ./dist folder

