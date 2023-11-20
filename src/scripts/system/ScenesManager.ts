import * as PIXI from "pixi.js";
import { App } from "./App";
import { Scene } from "./Scene";
import {Config} from "../game/Config";
import { GameScene } from "../game/GameScene";

export class ScenesManager {
    container: PIXI.Container;
    scene: Scene | GameScene | undefined | null;
   
    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.scene = null;
    }

    start(scene:Scene | GameScene | string) {
        if (this.scene) {
            this.scene.destroy();
        }

        if(App.config?.scenes){
           
            this.scene = new (App.config?.scenes[scene as unknown as keyof typeof Config.scenes])();
        }
        this.container.addChild(this?.scene?.container as unknown as PIXI.DisplayObject);
    }

    update(dt:number) {
        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}