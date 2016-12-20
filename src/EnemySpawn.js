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
        this.currentParams = null;
        this.world = world;
    }

    getRandomMoveFunctionIndex () {
        return Math.floor(Math.random()*this.enemyParams.length);
    }
}

export class EnemySpawnCenter extends EnemySpawn {
    constructor (world) {
        super(world);
        this.enemyShape = EnemyDrone.SHAPES[0];
        /*this.enemyShipShape = [
            new Point(0,0),
            new Point(-10,10),
            new Point(0,15),
            new Point(10,10)
        ];*/
        //define movement parameters
        this.enemyParams.push(
            () => {
                console.log('getting new params');
                return {
                    position: new Point(this.position.x, this.position.y),
                    speed: 75,
                    velocity: new Point(0,1),
                    color: Helper.randInGroup(['#f00', '#0f0', '#00f']),
                    shape: this.enemyShape,
                    moveAmp: Helper.randInGroup([-1, 1]),
                    moveFreq: Helper.randInGroup([1,2,3,4]),
                    moveFunction: EnemyDrone.MoveSine
                }
            }
        );
        this.enemyParams.push(
            () => {
                return {
                    position: new Point(this.position.x, this.position.y),
                    speed: 75,
                    velocity: new Point(0,1),
                    color: '#f00',
                    shape: this.enemyShape,
                    moveFunction: null
                }
            }
        );
        this.enemyParams.push(
            () => {
                return {
                    position: new Point(this.position.x, this.position.y),
                    speed: Helper.randIntInRange(50,50),
                    velocity: new Point(0,1),
                    color: '#f00',
                    shape: this.enemyShape,
                    moveAmp: 2.5,
                    moveFreq: Math.random() > 0.5 ? 1 : -1,
                    moveFunction: EnemyDrone.MoveCircle
                }
            }
        );
    }

    startSpawn (count) {
        this.spawnCount = count;
        this.spawnTimer = 0;
        this.spawning = true;
        this.spawnRate = Helper.randInRange(this.minSpawnTime, this.maxSpawnTime);
        this.currentParams = this.enemyParams[Helper.randIntInRange(0,this.enemyParams.length-1)]();
    }

    makeEnemy () {
        if (!this.world){
            console.log('no world for spawn');
            return;
        }
        let enemy = new EnemyDrone();
        enemy.set(this.currentParams);

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
