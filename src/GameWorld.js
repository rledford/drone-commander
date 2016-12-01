const MAX_PARTICLES = 500;

export class GameWorld {

    constructor () {
        this.player = {
            drone: null,
            bullets: {}
        }

        this.enemy = {
            drones: {},
            bullets: {}
        }

        this.environment = {
            dangers: {},
            powerups: {}
        }
    //particles do not need to be refereced by ID since they will be strictly managed by the world once they have been create
        this.particles = [];
    }

    //for the functions below
    //'object' and 'group' are tested for collisions with the provided 'func'
    //if a collision is detected the 'callback' is called with the
    //colliding object(s) as an argument
    getFirstCollision (object, group, func, callback){
        for (let i = 0; i < group.length; i++){
            if (func(object, group[i])){
                return callback(group[i]);
            }
        }
    }

    getAllCollisions (object, group, func, callback){
        let all = [];
        for (let i = 0; i < group.length; i++){
            if (func(object, group[i])){
                all.push(group[i]);
            }
        }
        if (all.length > 0){
            callback(all);
        }
    }
}
