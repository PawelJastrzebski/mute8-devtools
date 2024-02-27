import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { newStore } from "mute8-solid";
import { eventPreviewDisplay } from "./MonacoEditor";
import { topControls } from "../components/panel/TimelineTopControls";
import { storageList } from "../components/panel/SideBar";
import { timelineRender } from "./TimelineRender";
import { overrideController } from "./OverrideController";
import { expandFullStatePreview, storeFullPreview } from "../components/panel/FullStatePreview";
import { StoreEvent } from "./StoregeEvent";
import { eventsListController } from "./EventsListController";

const key = "-selected-store-";
export const setSelectedMute8StoreCache = (phrase: string | null) => {
    !!phrase ? localStorage.setItem(key, phrase) : localStorage.removeItem(key)
}
export const getSelectedMute8StoreCache = () => localStorage.getItem(key);

const createListItemStore = () => {
    return newStore({
        value: {
            events: 0,
            selected: false,
            overrided: false
        },
        actions: {
            setEventsCount(value: number) {
                this.events = value
            },
            setSelected(selected: boolean) {
                this.selected = selected;
            },
            setOverride(overrided: boolean) {
                this.overrided = overrided;
            }
        }
    })
}
type Mute8StoreInstance = ReturnType<typeof createListItemStore>;

export class Mute8Storage {
    label: string
    events: Array<StoreEvent> = []
    store: Mute8StoreInstance = createListItemStore()
    cursor: null | number = null;
    overrided: boolean = false;

    constructor(label: string) {
        this.label = label;
    }

    addEvent(event: StoreEvent): StoreEvent {
        this.events.push(event)
        this.store.actions.setEventsCount(this.events.length)
        return event
    }

    total(): number {
        return this.events.length
    }

    getFirst(): StoreEvent | null {
        this.cursor = 0;
        return this.getSelected()
    }

    getLast(): StoreEvent | null {
        this.cursor = Math.max(this.events.length - 1, 0)
        return this.getSelected()
    }

    setCursorById(eventId: number) {
        const item = this.events.find(e => e.id === eventId);
        if (!item) return;
        this.cursor = (this.events.indexOf(item) ?? this.cursor)
    }

    getCursor(): number {
        return this.cursor = this.cursor ?? Math.max(this.events.length - 1, 0)
    }

    getSelected(): StoreEvent | null {
        return this.get(0)
    }

    has(offset: number): boolean {
        const next = (this.getCursor() + offset);
        return next >= 0 && next <= (this.events.length - 1)
    }

    get(offset: number): StoreEvent | null {
        if (this.has(offset)) {
            this.cursor = this.cursor! + offset;
            return this.events[this.cursor]
        }
        return null
    }

    revind(offset: number) {
        const event = this.get(offset)
        if (!!event) return event
        return offset <= 0 ? this.getFirst() : this.getLast()
    }
}

class StorageController {
    registry: Map<string, Mute8Storage> = new Map();
    selected: Mute8Storage | null = null;

    // Utils
    getMute8ViewStore(label: string): Mute8StoreInstance {
        return this.getOrCreateStorage(label).store
    }

    getOrCreateStorage(storageLabel: string): Mute8Storage {
        const inRegistry = this.registry.get(storageLabel)
        if (!!inRegistry) {
            return inRegistry
        }
        const storage = new Mute8Storage(storageLabel);
        this.registry.set(storageLabel, storage)
        storageList.actions.updateAll(this.registry)
        return storage
    }

    // Hanlde Incoming Data
    init(init: Types.DevToolsInit) {
        // reset
        this.registry = new Map()
        this.selected = null;
        eventsListController.reset()

        // init defs
        for (let def of init.definitions) {
            this.getOrCreateStorage(def.label)
        }
        storeFullPreview.actions.reset(this.registry.size)

        // init ovverrides
        overrideController.setInit(init.overrides)
        storageList.actions.updateAll(this.registry)
        setTimeout(() => this.selectStore(getSelectedMute8StoreCache()), 50)
        setTimeout(() => expandFullStatePreview(), 200)
    }
    pushStorageEvent(lable: string, event: StoreEvent) {
        const storage = this.getOrCreateStorage(lable);
        const newEvent = storage.addEvent(event)

        if (storage.label === this.selected?.label) {
            topControls.actions.updateStatus(this.selected)
            timelineRender.addEvent(newEvent)
        }
        storeFullPreview.actions.updateStoreState(lable, event.state)
        eventsListController.addEvent(event)
    }

    // Controls
    selectStore(label: string | null = this.selected?.label ?? null) {
        const l = label ?? "";
        // unselect
        if (this.selected) {
            if (this.selected.label == l) return;
            this.selected.store.actions.setSelected(false)
        }
        // select
        this.selected = this.registry.get(l) ?? null
        if (this.selected) {
            setSelectedMute8StoreCache(l)
            this.selected.store.actions.setSelected(true)
        }

        this.selectEvent(this.selected?.getSelected() ?? null)
        timelineRender.renderAll(this.selected?.events ?? [])
    }
    nextEvent() {
        if (!this.selected) return
        if (this.selected.has(+1)) {
            this.selectEvent(this.selected.get(+1))
        }
    }
    previousEvent() {
        if (!this.selected) return
        if (this.selected.has(-1)) {
            this.selectEvent(this.selected.get(-1))
        }
    }
    rewindToEvent(offset: number) {
        if (!this.selected) return
        this.selectEvent(this.selected.revind(offset))
    }
    latestEvent() {
        if (!this.selected) return
        this.selectEvent(this.selected.getLast())
    }
    private selectEvent(event: StoreEvent | null) {
        if (this.selected && this.selected.overrided && event) {
            overrideController.setOverride(this.selected.label, true, event)
        }
        this.updateSelectedPreview()
        eventsListController.virtualizer.scrollTo(event?.id)
    }
    updateSelectedPreview() {
        eventPreviewDisplay(this.selected?.getSelected() ?? null)
        topControls.actions.updateStatus(this.selected)
        eventsListController.virtualizer.rerender()
    }
    toggleOverride() {
        if (!this.selected) return
        overrideController.setOverride(this.selected.label)
    }
    isSelectedById(label: string, eventId: number): boolean {
        if (this.selected?.label !== label) return false;
        const event = this.selected.getSelected()
        return event?.id === eventId
    }
}

export const storageController = new StorageController()