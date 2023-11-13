import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Platform } from "./Platform";

interface EnemyBody extends Matter.Body {
  gameEnemy: Enemy;
}

export class Enemy {
  jumpIndex: number;
  dx: number;
  platform: Platform | undefined;
  body: Matter.Body | undefined;
  sprite: PIXI.AnimatedSprite | undefined | null;

  constructor() {
    this.createSprite();
    this.createBody();
    this.dx = -2;
    App?.app?.ticker.add(this.update, this);
    this.jumpIndex = 0;
  }

  // [08]
  stayOnPlatform(platform:Platform) {
    this.platform = platform;
    this.jumpIndex = 0;
  }
  // [/08]

  createBody() {
   
    if(this.sprite && App.physics){

      this.body = Matter.Bodies.rectangle(
        this.sprite.x + this.sprite.width / 2,
        this.sprite.y + this.sprite.height / 2,
        this.sprite.width,
        this.sprite.height,
        { friction: 0}
      );
    
     
      (this.body as EnemyBody).gameEnemy = this;

      Matter.World.add(App.physics.world, this.body);
    
    }
    
  }

  update() {

    if(this.sprite && App.physics && this.body){
    this.sprite.x = this.body.position.x - this.sprite.width / 2;
    this.sprite.y = this.body.position.y - this.sprite.height / 2;

    Matter.Body.setPosition(this.body, {x: this.body.position.x + this.dx, y: this.body.position.y});   

    this.sprite.x = this.body.position.x - this.sprite.width / 2;
    this.sprite.y = this.body.position.y - this.sprite.height / 2;
    
    // [14]
    if (this.sprite.y > window.innerHeight) {
      this.sprite.emit("die");
    }
    // [/14]

  }
  }

  createSprite() {

  this.sprite = new PIXI.AnimatedSprite([
    App.res("enemy_walk1"),
    App.res("enemy_walk2")
    
  ]as PIXI.Texture<PIXI.Resource>[] | PIXI.FrameObject[]);

    
if(this.sprite && App.config){
  this.sprite.x = App.config.enemy.position.x;
  this.sprite.y = App.config.enemy.position.y;
  this.sprite.loop = true;
  this.sprite.animationSpeed = 0.1;
  this.sprite.play();
}
   
}

  destroy() {
    if (this.sprite && App.physics && this.body) {
      App?.app?.ticker.remove(this.update, this);
      Matter.World.remove(App.physics.world, this.body);
      this.sprite.destroy();
      this.sprite = null;
  }
  }
}
