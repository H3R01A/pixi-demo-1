import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { LabelScore } from "./LabelScore";
import { App } from "../system/App";
import { Background } from "./Background";
import { Scene } from "../system/Scene";
import { Hero } from "./Hero";
import { Enemy } from "./Enemy";
import { Platforms } from "./Platforms";
import { Platform } from "./Platform";
import { Diamond } from "./Diamond";

type GameScenePlatform = {
  gamePlatform: Platform;
};

type GameSceneDiamond = {
  gameDiamond: Diamond;
};
type GameSceneEnemy = {
  gameEnemy: Enemy;
};

type GameBodyPair = {
  gamePlatform: Platform;
  gameHero: Hero;
  gameDiamond: Diamond;
  gameEnemy: Enemy;
};

interface MatterEventDetector extends Matter.Events {
    source: {
        detector: Matter.Detector
    }
}

export class GameScene extends Scene {
  container!: PIXI.Container;
  labelScore: LabelScore | undefined;
  hero: Hero | undefined;
  enemy: Enemy | undefined;
  bg: Background | undefined;
  platforms: Platforms | undefined;

//   constructor() {
//     super();
//     this.createBackground();
//     this.createHero();
//     this.createEnemy();
//     this.createPlatforms();
//     this.setEvents();
//     //[13]
//     this.createUI();
//   }

   create() {
      this.createBackground();
      this.createPlatforms();
      this.createHero();
      this.createEnemy();
      this.setEvents();
      //[13]
      this.createUI();
      //[/13]
    }

  createUI() {
    this.labelScore = new LabelScore();
    this.container.addChild(this.labelScore);
    if (this.hero && this.labelScore) {
      this.hero.sprite?.on("score", () => {
        this.labelScore?.renderScore(this.hero?.score);
      });
    }
  }
  //[13]

  setEvents() {
    Matter.Events.on(
      App.physics,
      'collisionStart',
      this.onCollisionStart.bind(this)
    );
  }

  onCollisionStart(event: Matter.Events) {

    // console.log(event);
    

    const collisions = Matter.Detector.collisions((event as MatterEventDetector).source.detector);

    // console.log('here are collisions in the game', collisions);
    // console.log('hi with onCollision Start - the pairs', pairs.bodyA, pairs.bodyB)

    const {pair} = collisions[0];

    if (pair) {
       
      if ("bodyA" in pair && "bodyB" in pair) {


        const colliders = [pair.bodyA, pair.bodyB];
       

        const hero = colliders.find((body) => (body as unknown as GameBodyPair).gameHero);

        const enemy = colliders.find((body) => (body  as unknown as  GameBodyPair).gameEnemy) as unknown as GameSceneEnemy;

        const platform = colliders.find((body) => (body  as unknown as GameBodyPair).gamePlatform) as unknown as GameScenePlatform;

        const diamond = colliders.find((body) => (body  as unknown as  GameBodyPair).gameDiamond) as unknown as GameSceneDiamond;

        console.log({hero, enemy});

        if (hero && platform) {
          this.hero?.stayOnPlatform(platform.gamePlatform);
        }

        if (enemy && platform) {
          this.enemy?.stayOnPlatform(platform.gamePlatform);
        }

        if (hero && diamond) {
          this.hero?.collectDiamond(diamond.gameDiamond);
        }

        if (hero && enemy) {
          console.log('hero and enemy clash');
          this.hero?.destroyEnemy(enemy.gameEnemy);
        }
      }
    }
  }

  createHero() {
    this.hero = new Hero();
    if (this.hero.sprite) {
      this.container.addChild(this.hero.sprite);

      this.container.interactive = true;
      this.container.on("pointerdown", () => {
        this.hero?.startJump();
      });

      // [14]
      this.hero.sprite.once("die", () => {
        App.scenes?.start("Game");
      });
      // [/14]
    }
  }

  createEnemy() {
    this.enemy = new Enemy();
    if (this.enemy.sprite) {
      this.container.addChild(this.enemy.sprite);

      this.container.interactive = true;

      this.enemy.sprite.once("die", () => {
        this.enemy?.destroy();
        this.createEnemy();
      });
    }
  }

  createBackground() {
    this.bg = new Background();
    this.container.addChild(this.bg.container);
  }

  createPlatforms() {
    this.platforms = new Platforms();
    this.container.addChild(this.platforms.container);
  }

  update(dt: number) {
    this.bg?.update(dt);
    this.platforms?.update();
  }

  destroy() {
    Matter.Events.off(
      App.physics,
      "collisionStart",
      this.onCollisionStart.bind(this)
    );
    App.app?.ticker.remove(this.update, this);
    this.bg?.destroy();
    this.hero?.destroy();
    this.enemy?.destroy();
    this.platforms?.destroy();
    this.labelScore?.destroy();
  }
}
