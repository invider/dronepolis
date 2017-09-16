# City of Lost Drones

js13k compo entry

## Controls

WASD/Cursor keys - move around
Space/Shift/E - shoot
Q - pass control of current drone to AI
Tab/Backspace - jump into next/previous drone of your team (or any drone in Demo mode)
F1 - enable Demo mode
F2 - show debug info
F4 - spawn new lost drone
F5 - spawn a drone to join random team
F12 - upgrade drone


## Things left to do that haven't got into compo version
- [ ] fix unlimited shields bug
- [ ] fix levelup bug
- [ ] stop bots colliding into the walls over and over again
- [ ] stop bots trying to fire at each other through the walls
- [ ] make bots better maze explorers
- [ ] bots should target faster
- [ ] bots should start dodging when fired upon
- [ ] make more physically accurate drone collisions
- [ ] fix killed-by-the-wall type of collisions
- [ ] make bots more aggressive (they should attack instead of collecting pods when enemies are around)
- [ ] explosions
- [ ] introduce penalty for hitting walls or drones
- [ ] introduce laser overhea
- [ ] update sfx
- [ ] hot-seat mode


## How to build minimized version

### Building Toolchain

Note: npm should be installed to obtain the toolchain

Run ./install-toolchain

Run ./build

If gulp got frozen, it usually happens when obsolete version of nodejs is used - upgrade to at least 8.4.0

The generated game archive and js/html files are located in ./dist folder


