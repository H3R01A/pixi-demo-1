import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class LabelScore extends PIXI.Text {

    constructor() {
        super();
        this.x = App.config?.score.x as number;
        this.y = App.config?.score.y as number;
        this.anchor.set(App.config?.score.anchor);
        this.style = App.config?.score.style as PIXI.TextStyle | Partial<PIXI.ITextStyle>;
        this.renderScore();
    }

    renderScore(score = 0) {
        this.text = `Score: ${score}`;
    }
}