import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Background {
    speed: number | undefined;
    container: PIXI.Container;
    sprites: PIXI.Sprite[] | undefined;

    constructor() {
        this.speed = App?.config?.bgSpeed;
        this.container = new PIXI.Container();
        this.createSprites();
    }

    createSprites() {
        this.sprites = [];

        for (let i = 0; i < 3; i++) {
            this.createSprite(i);
        }
    }

    createSprite(i:number) {
        const sprite = App.sprite("bg");

        sprite.x = sprite.width * i;
        sprite.y = 0;
        this.container.addChild(sprite);
        this.sprites?.push(sprite);
    }

    move(sprite: PIXI.Sprite, offset: number) {
        const spriteRightX = sprite.x + sprite.width;

        const screenLeftX  = 0;

        if (spriteRightX <= screenLeftX) {
            
            
            if(this.sprites){

            sprite.x += sprite.width * this.sprites?.length;
            }
            
        }
        
        sprite.x -= offset;
    }

    update(dt: number) {
        
        if(this.speed){
            const offset = this.speed * dt;
            this.sprites?.forEach(sprite => {
                this.move(sprite, offset);
            });
        }
       
    }

    destroy() {
        this.container.destroy();
    }
}