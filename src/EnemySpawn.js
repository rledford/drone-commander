import { Point } from './Point';
import { Shape } from './Shape';
import { EnemyDrone } from './EnemyDrone';
import * as Helper from './Helper';

export class EnemySpawn{
    constructor (world) {
        this.position = new Point();//where in the game world is this located
        this.minSpawnTime = 0.5;
        this.maxSpawnTime = 1;
        this.spawnTimer = 0;//track how long it has been since last spawn
        this.spawnRate = 1;//how fast is this spawning enemies
        this.spawnCount = 0;//how many enemies are left to spawn
        this.spawning = false;//is this currently spawnin enemies
        this.nextWave = 0;//how long until next wave is spawned
        this.enemyParams = [];//parameters to use when enemies are spawned
        this.enemyParamsIndex = 0;
        this.world = world;
    }

    getRandomMoveFunctionIndex () {
        return Math.floor(Math.random()*this.enemyParams.length);
    }
}

export class EnemySpawnCenter extends EnemySpawn {
    constructor (world) {
        super(world);
        this.enemyShipShape = [
            new Point(0,0),
            new Point(-10,10),
            new Point(0,15),
            new Point(10,10)
        ];
        //define movement parameters
        this.enemyParams.push(
            //return function that generates parameters that will be applied to enemy drones
            () => {
                return {
                    position: new Point(this.position.x, this.position.y),
                    speed: Helper.randIntInRange(50,50),
                    velocity: new Point(0,1),
                    color: '#f00',
                    shape: Shape.FromPoints(this.enemyShipShape, true),
                    moveFunction: EnemyDrone.MoveCircle(2,2)
                }
            }
        );
    }

    startSpawn (count) {
        this.spawnCount = count;
        this.spawnTimer = 0;
        this.spawning = true;
        this.spawnRate = Helper.randInRange(this.minSpawnTime, this.maxSpawnTime);
        this.enemyParamsIndex = 0;//this.getRandomMoveFunctionIndex();
    }

    makeEnemy () {
        if (!this.world){
            console.log('no world for spawn');
            return;
        }
        let enemy = new EnemyDrone();
        let params = this.enemyParams[this.enemyParamsIndex]();
        console.log(params);
        enemy.set(params);

        this.world.enemy.drones.push(enemy);
    }

    update (dt) {
        if (!this.spawning){
            this.nextWave -= dt;
            if (this.nextWave <= 0){
                this.startSpawn(5);
            }
            return;
        }

        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnRate){
            this.spawnTimer -= this.spawnRate;
            this.makeEnemy();
            this.spawnCount--;
            if (this.spawnCount === 0){
                this.spawning = false;
                this.nextWave = Math.random() * (5 - 3) + 3;
            }
        }
    }
}

export class EnemeySpawnMidLeft extends EnemySpawn {

}

export class EnemySpawnLeft extends EnemySpawn {

}

export class EnemySpawnMidRight extends EnemySpawn {

}

export class EnemySpawnRight extends EnemySpawn {

}
