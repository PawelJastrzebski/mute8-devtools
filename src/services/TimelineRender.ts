import * as PIXI from 'pixi.js';
import { StoreEvent } from './StoregeEvent';
import { showTimeline } from '../components/panel/Timeline';

const now = () => new Date().getTime()
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
            this.beginFill("#ddd");
            this.drawRect(w - fromRight, 0, 1, this.app.screen.height);
        }
    }
    update(scale: number) {
        this.myScale = scale;
        this.draw()
    }
}

class TimelineRender {
    // {scale} px per second
    scale = 100;
    canvas: HTMLCanvasElement | null = null;
    app: PIXI.Application<PIXI.ICanvas> | null = null;
    renderEvent: TimelineEvent[] = []
    storeEvents: StoreEvent[] = []
    constructor(private canvasId: string) {}

    private handleMouseWheel(e: WheelEvent) {
        const x = e.deltaY > 0 ? -1 : 1;
        this.scale = between(1, 1000, this.scale + (this.scale / 20) * x)
    }

    private renderTicker() {
        for (let index = this.renderEvent.length - 1; index >= 0; index--) {
            this.renderEvent[index].update(this.scale)
        }
    }

    private fullRerender() {
        this.renderEvent = [];
        if (!this.app) return
        for (const e of this.storeEvents) {
            const toRender = new TimelineEvent(e, this.app, this.scale);
            this.app.stage.addChild(toRender)
            this.renderEvent.push(toRender)
        }
    }

    mount() {
        const wrapper = document.getElementById(this.canvasId) as HTMLCanvasElement;
        if (!wrapper) return;
        // create DOM canvas
        this.canvas = document.createElement("canvas")
        this.canvas.id = this.canvasId + "-canva"
        this.canvas.removeEventListener("wheel", this.handleMouseWheel.bind(this));
        this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.canvas = wrapper.appendChild(this.canvas)

        // Create app
        const app = new PIXI.Application({
            view: this.canvas,
            resizeTo: wrapper,
            autoStart: true,
            backgroundColor: "#242526",
        });
        app.ticker.maxFPS = 60
        app.ticker.minFPS = 10
        app.ticker.add(this.renderTicker.bind(this))
        this.app = app;

        // render
        this.fullRerender()
        showTimeline()
    }

    unmount() {
        this.renderEvent = [];
        if (!this.app) return
        this.app.destroy(true, true)
        this.app = null;
        this.canvas = null;
    }

    // timeline render controll

    clearEvents() {
        this.storeEvents = [];
        this.renderEvent = [];
        if (!this.app) return
        this.app.stage.removeChildren(0, this.app.stage.children.length)
    }

    addEvent(e: StoreEvent) {
        this.storeEvents.push(e)
        if (!this.app) return
        const event = new TimelineEvent(e, this.app, this.scale)
        this.renderEvent.push(event)
        this.app?.stage.addChild(event)
    }

    renderAll(events: StoreEvent[]) {
        this.clearEvents()
        for (const e of events) {
            this.addEvent(e)
        }
    }
}
export const timelineRender = new TimelineRender("timeline-canvas-wrapper");