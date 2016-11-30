import React, {Component} from 'react';
import './Game.css'
import { Point } from './Point'
import { Drone } from './Drone';

function GamePanel(props){
    return (
        <div>
        </div>
    );
}

export class DroneCommander extends Component{

    constructor(props){
        super(props);
        this.state = {
            traveled: 0,//distance traveled km - score
            screen: {
                //NOTE: to get inner window size {window.innerWidth, window.innerHeight}
                width: 400,
                height: parseInt(400*1.25, 10)
            },
            context: null//canvas 2d context
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

        //generic object to store game objects
        this.objects = {
            player: null,
            enemies: []
        }
    }

    initGameObjects () {
        let drone = new Drone();
        let ship = [
            new Point(0,0),
            new Point(10,-20),
            new Point(20,0),
            new Point(10,-5),
        ];
        let rect = [
            new Point(0,0),
            new Point(0,-20),
            new Point(20,-20),
            new Point(20, 0)
        ];
        drone.setShape(ship);
        drone.setPosition({
            x: this.state.screen.width * 0.5,
            y: 50
        });

        this.objects.player = drone;
    }

    componentDidMount(){
        //get reference to canvas 2d context
        const context = document.getElementById('GameView').getContext('2d');
        this.setState({
            context: context
        });
        //need to listen to mouseup / touch up event globally
        //so if the canvas was being touched, then the touch leaves, and is released
        //it can be handled appropriately
        window.addEventListener('mouseup', this.handleTouchUp);

        //wire up the game loop
        requestAnimationFrame( () => { this.update() } );

        //init objects for testing
        this.initGameObjects();
        this.lastTick = Date.now();
    }

    componentWillUnmount(){
        //remove event window event listeners
        window.removeEventListener('mouseup',this.handleTouchUp);
    }

    handleTouchDown(event){
        this.isTouched = true;
        this.touchPos = this.unprojectTouch(event);
        console.log('touch down');
    }

    handleTouchUp(event){
        this.isTouched = false;
        this.touchPos = null;
        console.log('touch up');
    }

    handleTouchMove(event){
        this.touchPos = this.unprojectTouch(event);
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
        return {
            x: event.nativeEvent.clientX - event.target.offsetLeft + window.pageXOffset,
            y: event.nativeEvent.clientY - event.target.offsetTop + window.pageYOffset
        }
    }

    update(){
        //game logic
        let timepassed = (Date.now() - this.lastTick) * 0.001;//scale milliseconds to seconds
        let player = this.objects.player;
        let state = this.state;
        const touch = this.touchPos;
        const context = this.state.context;

        if (player){
            if (touch !== null && this.isTouched){
                player.setDestination(touch);
            }
            player.update(timepassed);
        }

        this.draw();
        this.lastTick = Date.now();
        requestAnimationFrame( () => { this.update() } );//next frame

    }

    draw(){
        let player = this.objects.player;

        const context = this.state.context;
        const screen = this.state.screen;
        context.fillStyle = '#000';
        //clear the screen
        context.fillRect(0,0,screen.width, screen.height)


        //TEST GAME OBJECTS
        if (player !== null){
            player.draw(context);
        }
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
                />
            </div>
        );
    }
}
