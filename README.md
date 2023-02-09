|| Treasure Wars! ||\
---Background---\
Treasure Wars! is a 2 player turn-based strategy game in which the 2 players will play against eachother, and attempt to capture the treasure chest from the opponent's base and bring it back to their own base.\
https://jasminekobata.github.io/Javascript-Project/

---Gameplay--\
| BUYING |\
Each team has two barracks that can generate new units, with a total maximum of 8 units.
There are 3 different types of units that can be spawned, as follows:

- Infantry:	Defense 2, Attack 2, Attack Range 1\
- Archer:	Defense 1, Attack 1, Attack Range 2\
- Infantry:	Defense 3, Attack 1, Attack Range 1

| MOVING |\
All units can move 2 squares in any direction

| UPGRADING |\
Each unit can be upgraded when in enemy territory, as follows:

- Infantry:	Defense +1, Attack +2\
- Archer:	Defense +1, Attack +1\
- Infantry:	Defense +2, Attack +1

Upgrading will restore any lost unit defense points. Units cannot attack after upgrading until the next round. Stats will revert to their original state once returning to friendly territory.

| TREASURE |\
The treasure is picked up by moving a unit onto the square containing it. Units can only pick up enemy treasure.

| Price Chart |\
Moving:		1 Action Point\
Attacking:	1 Action Point\
Buying:		2 Action Points\
Upgrading:	2 Action Points


---Technologies, Libraries, APIs---
This project was implemented using the following:

- Canvas API
- Webpack
- npm

--Future Updates--
- Animations for moving/ugrading/attacking
- Tutorial Mode
- AI for solo play
- Sockets for remote gameplay
