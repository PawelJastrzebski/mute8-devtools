import { storageController } from "./StorageController";

class Keyboard {
    constructor() {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }
    init() {
        console.log('init key')
        document.removeEventListener('keydown', this.handleEvent.bind(this))
        document.addEventListener('keydown', this.handleEvent.bind(this))
    }
    handleEvent(event: KeyboardEvent) {
        if(event.code == "ArrowRight") {
            storageController.nextEvent()
        }
        if(event.code == "ArrowLeft") {
            storageController.previousEvent()
        }
        if(event.code == "Space") {
            storageController.latestEvent()
        }
    }
}

export const keyboard = new Keyboard()