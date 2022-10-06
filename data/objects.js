class Dot {
    constructor(pos = [0, 0], vel = [0, 0], size = 10, color = "#2D3142") {
        this.pos = pos;
        this.vel = vel;
        this.size = size;
        this.color = color;
    }
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}