import React, {Component} from 'react';
import './Game.css'
import { Point } from './Point'
import { Shape } from './Shape'
import { PlayerDrone } from './PlayerDrone';
import { EnemyDrone } from './EnemyDrone';
import { ShapeHelper } from './ShapeHelper';
import { GameWorld } from './GameWorld';
import { GameObject } from './GameObject';
import * as EnemySpawn from './EnemySpawn';
import * as Collectable from './Collectable';
export class DroneCommander extends Component{

    constructor(props){
        super(props);
        this.state = {
            traveled: 0,//distance traveled km - score
            screen: {
                //NOTE: to get inner window size {window.innerWidth, window.innerHeight}
                width: 480,
                height: 640,
                ratio: window.devicePixelRatio
            },
            context: null,//canvas 2d context
            inputType: 'none'
        }
        this.touchPos = null;//will be {x: int, y: int} when the canvas is touched/clicked
        this.isTouched = false;

        this.lastTick = 0;//used to track time between frames;

        //bind event handlers so 'this' referes to this instance of DroneController
        this.handleTouchDown = this.handleTouchDown.bind(this);
        this.handleTouchUp = this.handleTouchUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchLeave = this.handleTouchLeave.bind(this);
        this.handleTouchEnter = this.handleTouchEnter.bind(this);

        this.world = null;
        this.player = null;
        this.spawn = null;
    }

    initTestGameObjects () {
        this.world = new GameWorld();
        this.player = new PlayerDrone();
        this.spawn = new EnemySpawn.EnemySpawnCenter(this.world);
        this.spawn.position.set({
            x: this.state.screen.width * 0.5,
            y: -25
        });
        this.spawn.startSpawn(10);
        for (let i = 0; i < 10; i++){
          let obj = new Collectable.CollectableShield();
          obj.position.set(new Point((i+1)*24,24));
          this.world.env.collectables.push(obj);
          /*
          let obj = new GameObject();
          obj.shape = Shape.Rectangle(20,20);
          obj.color = '#b928c2';
          obj.position = new Point(i*20,20);
          this.world.env.powerups.push(obj);
          */
        }
        let ship = [
            new Point(0,0),
            new Point(10,-20),
            new Point(20,0),
            new Point(10,-5),
        ];
        //this.player.shape = Shape.FromPoints(ship, true);
        this.player.bulletGroup = this.world.player.bullets;
        this.player.setPosition({
            x: this.state.screen.width * 0.10,
            y: this.state.screen.height - 25
        });
        this.world.player.drones.push(this.player);
    }

    checkIntersect(objA, objB){
        if (!objA.alive || !objB.alive) return false;
        if (ShapeHelper.ObjectsRiskIntersect(objA, objB)){
            return ShapeHelper.ObjectsIntersect(objA, objB);
        }
        return false;
    }

    handleCollisions () {
        this.world.player.drones.forEach( (player) => {
            this.world.enemy.drones.forEach( (enemy) => {
                //check if enemy is offscreen as early as possible
                if (enemy.position.y > this.state.screen.height + enemy.shape.range){
                    console.log('enemy off screen');
                    enemy.alive = false;
                    return;
                }
                if (this.checkIntersect(player, enemy)){
                    enemy.takeDamage();
                    player.takeDamage();
                }
            });
            this.world.enemy.bullets.forEach( (bullet) => {
                if (this.checkIntersect(player, bullet)){
                    player.takeDamage();
                    bullet.alive = false;
                }
            });
        });
        this.world.player.bullets.forEach( (bullet) => {
            this.world.enemy.drones.forEach( (enemy) => {
                if (this.checkIntersect(bullet, enemy)){
                    enemy.takeDamage();
                    bullet.alive = false;
                }
            });
            this.world.env.collectables.forEach( (collectable) => {
                if (this.checkIntersect(bullet, collectable)){
                  bullet.alive = false;
                  collectable.alive = false;
                  if (collectable.type === Collectable.Collectable.TYPE.POWERUP){
                    this.player.applyPowerup();
                    console.log('powerup');
                  }
                  else if (collectable.type === Collectable.Collectable.TYPE.SHIELD){
                    this.player.applyShield();
                    console.log('shield');
                  }
                }
            });
        });
    }

    componentDidMount(){
        //need to listen to mouseup / touch up event globally
        //so if the canvas was being touched, then the touch leaves, and is released
        //it can be handled appropriately
        window.addEventListener('mouseup', this.handleTouchUp);
        window.addEventListener('touchend', this.handleTouchUp);
        window.addEventListener('touchcancel', this.handleTouchUp);

        //get reference to canvas 2d context
        const canvas = document.getElementById('GameView');
        const context = canvas.getContext('2d');

        this.setState({
            context: context
        });

        //wire up the game loop
        requestAnimationFrame( () => { this.update() } );

        //init objects for testing
        this.initTestGameObjects();
        this.lastTick = Date.now();
    }

    componentWillUnmount(){
        //remove event window event listeners
        window.removeEventListener('mouseup',this.handleTouchUp);
    }

    handleTouchDown(event){
        this.isTouched = true;
        this.touchPos = this.unprojectTouch(event);
        event.preventDefault();//prevent window from scrolling
        console.log('touch down');
    }

    handleTouchUp(event){
        this.isTouched = false;
        this.touchPos = null;
        event.preventDefault();
        console.log('touch up');
    }

    handleTouchMove(event){
        this.touchPos = this.unprojectTouch(event);
        event.preventDefault();
    }

    handleTouchLeave(event){
        console.log('mouse leave');
        this.touchPos = null;
    }

    handleTouchEnter(event){
        console.log('mouse enter');
        if (this.isTouched){
            this.handleTouchDown(event);
        }
    }

    unprojectTouch(event){
        //unprojects the x,y coordinates in the touch event to
        //their position within the canvas
        if (event.type.indexOf('touch') !== -1){
            console.log('touch');
            let info = "touch: " + event.touches[0].toString();

            this.setState({inputType: info});
            return {
                x: event.touches[0].clientX - event.target.offsetLeft + window.pageXOffset,
                y: event.touches[0].clientY - event.target.offsetTop + window.pageYOffset
            }
        }
        this.setState({inputType: 'mouse'});
        return {
            x: event.nativeEvent.clientX - event.target.offsetLeft + window.pageXOffset,
            y: event.nativeEvent.clientY - event.target.offsetTop + window.pageYOffset
        }
    }

    update(){
        //game logic
        let timepassed = (Date.now() - this.lastTick) * 0.001;//scale milliseconds to seconds
        if (timepassed > 0.333){
            //skip this frame since there has probably been an issue with the browser / rendering / something else
            this.lastTick = Date.now();
            requestAnimationFrame( () => { this.update() } );//next frame
            return;
        }
        const touch = this.touchPos;
        const context = this.state.context;

        if (this.player){
            if (touch !== null && this.isTouched){
                this.player.setDestination(touch);
            }
        }

        this.spawn.update(timepassed);

        this.world.update(timepassed);
        this.handleCollisions();

        this.draw();
        this.lastTick = Date.now();
        requestAnimationFrame( () => { this.update() } );//next frame
    }

    draw(){
        const context = this.state.context;
        const screen = this.state.screen;
        context.fillStyle = '#000';
        //clear the screen
        context.fillRect(0,0,screen.width, screen.height)


        //TEST GAME OBJECTS
        this.world.draw(context);
    }

    render(){
        //need ot implement ui panel
        return (
            <div style={{textAlign: 'center'}}>
                <canvas id='GameView'
                    width={this.state.screen.width}
                    height={this.state.screen.height}

                    onMouseDown={this.handleTouchDown}
                    onMouseMove={this.handleTouchMove}
                    onMouseLeave={this.handleTouchLeave}
                    onMouseEnter={this.handleTouchEnter}
                    onTouchStart={this.handleTouchDown}
                    onTouchMove={this.handleTouchMove}
                />
            </div>
        );
    }
}
