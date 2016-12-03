import * as con from './constants';

//define locals for convenience and code clarity
let player = con.CAT_PLAYER,
    enemy = con.CAT_ENEMY,
    environment = con.CAT_ENV,
    drones = con.GRP_DRONES,
    bullets = con.GRP_BULLETS,
    dangers = con.GRP_DANGERS,
    powerups = con.GRP_PWRUPS;


export class GameWorld {

    //world manages categories that contain groups of objects in Dictionaries where keys are GameObject.id
    constructor () {
        //category
        this[player] = {
            //groups
            [drones]: {},
            [bullets]: {}
        }
        //category
        this[enemy] = {
            //groups
            [drones]: {},
            [bullets]: {}
        }
        //category
        this[environment] = {
            //groups
            [dangers]: {},
            [powerups]: {}
        }
        //particles do not need to be refereced by ID since they will be strictly managed by the world once they have been create
        this.particles = [];
    }

    addObject (object) {
        this[object.category][object.group][object.id] = object;
        object.world = this;
    }

    removeObject (object) {
        delete this[object.category][object.group][object.id];
    }

    update (dt) {
        for (let drone in this.player.drones){
            this.player.drones[drone].update(dt);
        }
        for (let bullet in this.player.bullets){
            this.player.bullets[bullet].update(dt);
        }
    }

    draw (context) {
        for (let drone in this.player.drones){
            this.player.drones[drone].draw(context);
        }
        for (let bullet in this.player.bullets){
            this.player.bullets[bullet].draw(context);
        }
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
