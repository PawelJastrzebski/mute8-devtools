import { toggleEventList } from "../components/panel/EventList";
import { focusStoreListFilter, selectStoreByListIndex, storeListFilterisFocused } from "../components/panel/SideBar";
import { refreshHostApp } from "./ClientConnector";
import { storageController } from "./StorageController";

const getRewindValue = (event: KeyboardEvent, value: number) => {
    value = event.ctrlKey ? value * 10 : value;
    return event.shiftKey ? value * 10 : value
}

const handleEvent = (event: KeyboardEvent) => {
    const c = event.code;
    const isLongPress = event.repeat;

    // Event preview & controlls
    if (c == "ArrowRight" || c == "ArrowUp" || c == "KeyD" || c == "KeyW") {
        storageController.rewindToEvent(getRewindValue(event, +1))
    }
    if (c == "ArrowLeft" || c == "ArrowDown" || c == "KeyA" || c == "KeyS") {
        storageController.rewindToEvent(getRewindValue(event, -1))
    }
    if (c == "Space") {
        storageController.toggleOverride()
    }
    if (c == "KeyE") {
        toggleEventList()
    }
    if (c == "KeyR") {
        refreshHostApp()
    }
    if (c == "Escape") {
        if (storeListFilterisFocused()) {
            (document.activeElement as HTMLElement)?.blur?.()
        } else {
            storageController.selectStore(null)
        }
    }

    // Sidebar
    if (c == "Backquote") {
        if (focusStoreListFilter()) {
            event.preventDefault()
        }
    }
    if (c.startsWith("Digit")) {
        const index = Number(c.replace("Digit", ""))
        selectStoreByListIndex(index - 1)
    }

    // Exit app
    if (c == "Escape" && isLongPress) {
        window.close()
    }
}

class Keyboard {
    constructor() {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }
    init() {
        document.removeEventListener('keydown', handleEvent)
        document.addEventListener('keydown', handleEvent)
    }
}

export const keyboard = new Keyboard()