import { toggleEventList } from "../components/panel/EventList";
import { focusStoreListFilter, toggleSelectedStoreByListIndex, storeListFilterisFocused } from "../components/panel/SideBar";
import { toggleTimelineUI } from "../components/panel/Timeline";
import { refreshHostApp } from "./ClientConnector";
import { eventsListController } from "./EventsListController";
import { storageController } from "./StorageController";

const getRewindValue = (event: KeyboardEvent, value: number) => {
    value = event.ctrlKey ? value * 10 : value;
    return event.shiftKey ? value * 10 : value
}

const handleEvent = (event: KeyboardEvent) => {
    const c = event.code;
    const isLongPress = event.repeat;

    // https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(c) > -1) event.preventDefault();

    // Event preview & controlls
    const nextEvent = c == "ArrowRight" || c == "ArrowUp" || c == "KeyD" || c == "KeyW";
    const previousEvent = c == "ArrowLeft" || c == "ArrowDown" || c == "KeyA" || c == "KeyS";
    const toggleOverride = c == "Space";
    if (!!storageController.selected) {
        if (nextEvent) {
            storageController.rewindToEvent(getRewindValue(event, +1))
        }
        if (previousEvent) {
            storageController.rewindToEvent(getRewindValue(event, -1))
        }
        if (toggleOverride) {
            storageController.toggleOverride()
        }

    } else {
        if (nextEvent) {
            eventsListController.rewind(getRewindValue(event, +1))
        }
        if (previousEvent) {
            eventsListController.rewind(getRewindValue(event, -1))
        }
        if (toggleOverride) {
            eventsListController.toggleOverrideSelected()
        }
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
        toggleSelectedStoreByListIndex(index - 1)
    }

    // Timelin
    if (c == "KeyT") {
        toggleTimelineUI()
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