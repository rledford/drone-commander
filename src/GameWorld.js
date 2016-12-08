
export class GameWorld {

    //world manages categories that contain groups of objects in Dictionaries where keys are GameObject.id
    constructor () {
        this.player = {
            //groups
            drones: [],
            bullets: []
        }
        //category
        this.enemy = {
            //groups
            drones: [],
            bullets: []
        }
        //category
        this.env = {
            //groups
            dangers: [],
            powerups: []
        }
        this.particles = [];
    }

    update (dt) {
        let i, obj;
        for (i = this.env.dangers.length - 1; i >= 0; i--){
            obj = this.env.dangers[i];
            if (!obj.alive){
                this.env.dangers.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }
        for (i = this.env.powerups.length - 1; i >= 0; i--){
            obj = this.env.powerups[i];
            if (!obj.alive){
                this.env.powerups.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }

        for (i = this.player.bullets.length - 1; i >= 0; i--){
            obj = this.player.bullets[i];
            if (!obj.alive){
                this.player.bullets.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }
        for (i = this.enemy.bullets.length - 1; i >= 0; i--){
            obj = this.enemy.bullets[i];
            if (!obj.alive){
                this.enemy.bulltes.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }

        for (i = this.player.drones.length - 1; i >= 0; i--){
            obj = this.player.drones[i];
            if (!obj.alive){
                this.player.drones.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }
        for (i = this.enemy.drones.length - 1; i >= 0; i--){
            obj = this.enemy.drones[i];
            if (!this.enemy.drones[i].alive){
                this.enemy.drones.splice(i, 1);
                continue;
            }
            obj.update(dt);
        }
    }

    draw (context) {
        this.enemy.drones.forEach( (obj) => {
            obj.draw(context);
        });
        this.enemy.bullets.forEach( (obj) => {
            obj.draw(context);
        });
        this.player.drones.forEach( (obj) => {
            obj.draw(context);
        });
        this.player.bullets.forEach( (obj) => {
            obj.draw(context);
        });
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
