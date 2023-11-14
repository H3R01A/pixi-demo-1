import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Platform } from "./Platform";
import { Enemy } from "./Enemy";
import { Diamond } from "./Diamond";


interface HeroBody extends Matter.Body {
  gameHero: Hero;
}

export class Hero {
  jumpIndex: number;
  dy: number | undefined;
  platform: Platform | undefined | null;
  body: Matter.Body | undefined;
  sprite: PIXI.AnimatedSprite | undefined | null;
  score: number;
  maxJumps: number | undefined;

  constructor() {
    this.createSprite();
    this.createBody();
    App.app?.ticker.add(this.update, this);

    if (App.config) {
      this.dy = App.config?.hero.jumpSpeed;
      this.maxJumps = App.config?.hero.maxJumps;
    }

    this.jumpIndex = 0;
    this.score = 0;
  }

  collectDiamond(diamond: Diamond) {
    if (this.sprite) {
      ++this.score;
      //[13]
      this.sprite.emit("score");
      //[/13]
      diamond.destroy();
    }
  }
  //[/12]

  destroyEnemy(enemy: Enemy) {
    if (enemy.sprite && this.sprite) {
      this.score += 2;
      this.sprite.emit("score");
      enemy.sprite.emit("die");
    }
  }

  startJump() {
    
    if (this.sprite && this.body) {
      this.sprite.textures = [App.res("jump")] as
        | PIXI.Texture<PIXI.Resource>[]
        | PIXI.FrameObject[];

     
      if (this.platform || this.jumpIndex === 1) {
        ++this.jumpIndex;
       
        this.platform = null;
        if (this.dy) {
          Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
      }
    }
  }

  // [08]
  stayOnPlatform(platform: Platform) {
    if (this.sprite) {
      this.platform = platform;
      this.jumpIndex = 0;
      this.sprite.textures = [App.res("walk1"), App.res("walk2")] as
        | PIXI.Texture<PIXI.Resource>[]
        | PIXI.FrameObject[];
      this.sprite.gotoAndPlay(0);
    }
  }
  // [/08]

  createBody() {

    if (this.sprite && App.physics) {
      this.body = Matter.Bodies.rectangle(
        this.sprite.x + this.sprite.width / 2,
        this.sprite.y + this.sprite.height / 2,
        this.sprite.width,
        this.sprite.height,
        { friction: 0}
      );

     

      Matter.World.add(App.physics.world, this.body);
      

      (this.body as HeroBody).gameHero = this;
      
    }
  }

  update(dt:number) {
    
    if (this.sprite && App.physics && this.body) {
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
      App.res("walk1"),
      App.res("walk2"),
    ] as PIXI.Texture<PIXI.Resource>[] | PIXI.FrameObject[]);

    if (this.sprite && App.config) {
      this.sprite.x = App.config.hero.position.x;
      this.sprite.y = App.config.hero.position.y;
      this.sprite.loop = true;
      this.sprite.animationSpeed = 0.1;
      this.sprite.play();
    }
  }

  destroy() {
    if (this.sprite && App.physics && this.body) {
      App.app?.ticker.remove(this.update, this);
      Matter.World.add(App.physics.world, this.body);
      this.sprite.destroy();
    }
  }
}
