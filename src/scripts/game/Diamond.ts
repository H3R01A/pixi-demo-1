import * as Matter from 'matter-js';
import { App } from '../system/App';
import * as PIXI from "pixi.js";

interface DiamondBody extends Matter.Body {
    gameDiamond: Diamond;
  }
  

export class Diamond {

    sprite: PIXI.Sprite | undefined | null;
    body: Matter.Body | undefined;

    constructor(x:number, y:number) {
        this.createSprite(x, y);
        App?.app?.ticker.add(this.update, this);
    }

    createSprite(x:number, y:number) {
        this.sprite = App.sprite("diamond");
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update() {
    
        if (this.sprite && this.body) {
            Matter.Body.setPosition(this.body, {x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y});
         
         
        }
    }

    createBody() {
        if(this.sprite && App.physics){
            this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }});
            this.body.isSensor = true;
            
            (this.body as DiamondBody).gameDiamond = this;
           
            Matter.World.add(App.physics.world, this.body);
        }
      
    }

    // [14]
    destroy() {
        if (this.sprite  && App.physics && this.body) {
            App?.app?.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}