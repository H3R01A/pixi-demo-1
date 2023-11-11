import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Enemy {
  constructor() {
    this.createSprite();
    this.createBody();
    this.dx = -2;
        App.app.ticker.add(this.update, this);
    this.jumpIndex = 0;
  }

  // [08]
  stayOnPlatform(platform) {
    this.platform = platform;
    this.jumpIndex = 0;
  }
  // [/08]

  createBody() {
    this.body = Matter.Bodies.rectangle(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height / 2,
      this.sprite.width,
      this.sprite.height,
      { friction: 0 }
    );
    Matter.World.add(App.physics.world, this.body);
    this.body.gameEnemy = this;
  }

  update() {

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

  createSprite() {
        this.sprite = new PIXI.AnimatedSprite([
      App.res("enemy_walk1"),
      App.res("enemy_walk2")
      
    ]);
    this.sprite.x = App.config.enemy.position.x;
    this.sprite.y = App.config.enemy.position.y;
    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
      }

  destroy() {
    if (this.sprite) {
      App.app.ticker.remove(this.update, this);
      Matter.World.remove(App.physics.world, this.body);
      this.sprite.destroy();
      this.sprite = null;
  }
  }
}
