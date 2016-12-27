import { ShapeHelper } from './ShapeHelper';
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
            collectables: []
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
        for (i = this.env.collectables.length - 1; i >= 0; i--){
            obj = this.env.collectables[i];
            if (!obj.alive){
                this.env.collectables.splice(i, 1);
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
                this.enemy.bullets.splice(i, 1);
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
        this.env.collectables.forEach( (obj) => {
          obj.draw(context);
        })
    }
}
