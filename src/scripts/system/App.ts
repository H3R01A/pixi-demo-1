import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";
import { Config } from "../game/Config";



class Application {
    config: typeof Config | undefined;
    app:PIXI.Application | undefined;
    loader: Loader | undefined;
    scenes: ScenesManager | undefined;
    physics: Matter.Engine | undefined;

    run(config:typeof Config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({resizeTo: window});
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());

        this.createPhysics();
      
        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        // [06]
        
    }

    createPhysics() {
        this.physics = Matter.Engine.create();
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.physics);
    }
    // [/06]

    res(key: string) {
        return this?.loader?.resources[key].texture;
    }

    sprite(key: string) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this?.scenes?.start("Game");
    }
}

export const App = new Application();