import * as PIXI from 'pixi.js';
import { StoreEvent } from './StorageController';

const calcPx = (milis: number, scalePx: number) => {
    const diffInSeconds = (milis) / 1000;
    return diffInSeconds * scalePx;
}

const between = (min: number, max: number, value: number): number => {
    return Math.min(Math.max(value, min), max)
}

class TimelineEvent extends PIXI.Graphics {

    constructor(
        private e: StoreEvent,
        private app: PIXI.Application,
        private myScale: number
    ) {
        super()
        this.draw()
    }

    draw() {
        const timeDiff = now() - this.e.time;
        const w = this.app.screen.width;
        const fromRight = calcPx(timeDiff, this.myScale);
        this.clear()
        if (fromRight <= w) {
            this.clear()
            this.beginFill("#ddd");
            this.drawRect(w - fromRight, 0, 1, this.app.screen.height);
        }
    }
    update(scale: number) {
        this.myScale = scale;
        this.draw()
    }

}

const now = () => new Date().getTime()
class TimelineRender {
    // {scale} px per second
    scale = 200;
    canvas: HTMLCanvasElement | null = null;
    app: PIXI.Application<PIXI.ICanvas> | null = null;

    events: TimelineEvent[] = []
    constructor(private canvasId: string) {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));

    }

    handleMouseWheel(e: WheelEvent) {
        if (e.deltaY > 0) {
            this.scale = between(50, 1000, this.scale - 10)
        } else {
            this.scale = between(50, 1000, this.scale + 10)
        }
    }

    init() {
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.canvas.removeEventListener("wheel", this.handleMouseWheel.bind(this));
        this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        const canvasSize = this.canvas.getBoundingClientRect();
        this.app = new PIXI.Application({
            width: canvasSize.width,
            height: canvasSize.height,
            view: this.canvas,
            resizeTo: this.canvas,
            background: "#242526",
        });
        this.app.ticker.maxFPS = 60
        this.app.ticker.minFPS = 10
        this.app.ticker.add(() => {
            for (const e of this.events) {
                e.update(this.scale)
            }
        })


    }

    clear() {
        if (!this.app) return
        this.events = [];
        this.app.stage.removeChildren(0, this.app.stage.children.length)
    }

    addEvent(e: StoreEvent, app = this.app) {
        if (!app) return
        const event = new TimelineEvent(e, app, this.scale)
        app.stage.addChild(event)
        this.events.push(event)
    }

    renderAll(events: StoreEvent[]) {
        this.clear()
        for (const e of events) {
            this.addEvent(e)
        }
    }
}

export const timelineRender = new TimelineRender("timeline-canvas");