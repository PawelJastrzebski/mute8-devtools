import { focusStoreListFilter, toggleSelectedStoreByListIndex, storeListFilterisFocused } from "../components/panel/SideBar";
import { toggleTimelineUI } from "../components/panel/Timeline";
import { refreshHostApp } from "./ClientConnector";
import { eventsListController } from "./EventsListController";
import { router, toggleFooter, toggleTopBar, toogleEventStackVersion, toogleSideBar } from "./Router";
import { setSelectedMute8StoreCache, storageController } from "./StorageController";

const getRewindValue = (event: KeyboardEvent, value: number) => {
    value = event.ctrlKey ? value * 10 : value;
    return event.shiftKey ? value * 10 : value
}

const handleEvent = (event: KeyboardEvent) => {
    const c = event.code;
    const isLongPress = event.repeat;
    const alt = event.altKey;
    const filterInFocus = storeListFilterisFocused()

    // https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(c) > -1) event.preventDefault();

    // escape focused input
    if (c == "Escape") {
        if (filterInFocus) {
            (document.activeElement as HTMLElement)?.blur?.()
        } else {
            setSelectedMute8StoreCache(null);
            storageController.selectStore(null)
        }
    }

    // input in focus (allow typing)
    if (filterInFocus) return;

    // Event preview & controlls
    const nextEvent = c == "ArrowRight" || c == "ArrowUp" || c == "KeyD" || c == "KeyW";
    const previousEvent = c == "ArrowLeft" || c == "ArrowDown" || c == "KeyA" || c == "KeyS";
    const toggleOverride = c == "Space";
    if (!!storageController.selected) {
        if (nextEvent) {
            alt ? storageController.latestEvent() : storageController.rewindToEvent(getRewindValue(event, +1))
        }
        if (previousEvent) {
            storageController.rewindToEvent(getRewindValue(event, -1))
        }
        if (toggleOverride) {
            storageController.toggleOverride()
        }

    } else if (router.eventStackVersion === "visible") {
        if (nextEvent) {
            alt ? eventsListController.selectLast() : eventsListController.rewind(getRewindValue(event, +1))
        }
        if (previousEvent) {
            eventsListController.rewind(getRewindValue(event, -1))
        }
        if (toggleOverride) {
            eventsListController.toggleOverrideSelected()
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

    // UI
    if (c == "KeyR") {
        refreshHostApp()
    }
    if (c == "KeyE") {
        toogleEventStackVersion()
    }
    if (c == "KeyT") {
        toggleTimelineUI()
    }
    if (c == "KeyI") {
        toggleTopBar()
        toggleFooter()
    }
    if (c == "KeyQ") {
        toogleSideBar()
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