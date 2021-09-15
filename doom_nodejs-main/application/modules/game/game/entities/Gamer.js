const Direction = Object.freeze({
    Forward: 0,
    Back: 1,
    Right: 2,
    Left: 3
})

class Gamer {
    constructor({ x, y, z, hp = 100, direction = {x:0, y:0, z:0} }) {
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.z = z;
        this.direction = direction;
    }

    move(direction, speed) {
        switch (direction) {
            case Direction.Forward: {
                this.x++;
            }
            case Direction.Back: {
                this.x--;
            }
            case Direction.Right: {
                this.z++;
            }
            case Direction.Left: {
                this.z--;
            }
        }
    }
}

module.exports = Gamer;