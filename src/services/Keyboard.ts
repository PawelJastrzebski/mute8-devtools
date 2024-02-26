import { storageController } from "./StorageController";

class Keyboard {
    constructor() {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }
    init() {
        document.removeEventListener('keydown', this.handleEvent.bind(this))
        document.addEventListener('keydown', this.handleEvent.bind(this))
    }

    getRewindValue(event: KeyboardEvent, value: number) {
        value = event.ctrlKey ? value * 10 : value;
        return event.shiftKey ? value * 10 : value
    }

    handleEvent(event: KeyboardEvent) {
        if (event.code == "ArrowRight" || event.code == "ArrowUp") {
            storageController.rewindToEvent(this.getRewindValue(event, +1))
        }
        if (event.code == "ArrowLeft" || event.code == "ArrowDown") {
            storageController.rewindToEvent(this.getRewindValue(event, -1))
        }
        if (event.code == "Space") {
            storageController.toggleOverride()
        }
    }
}

export const keyboard = new Keyboard()