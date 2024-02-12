import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { newStore } from "mute8-solid";
import { eventPreviewDisplay } from "./MonacoEditor";
import { topControls } from "../components/panel/TimelineTopControls";
import { storageList } from "../components/panel/SideBar";
import { timelineRender } from "./TimelineRender";
import { overrideController } from "./OverrideController";

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
            setOveridMode(overrided: boolean) {
                this.overrided = overrided;
            }
        }
    })
}
type Mute8StoreInstance = ReturnType<typeof createListItemStore>;

// Event Types
interface InitStateEvent {
    type: "init-state"
    state: object
    time: number
}

interface ChangeStateEvent {
    type: "change-state"
    oldState: object
    state: object,
    time: number
}
export type StoreEvent = InitStateEvent | ChangeStateEvent

export class Mute8Storage {
    label: string
    showOnTimeline: boolean
    events: Array<StoreEvent> = []
    store: Mute8StoreInstance = createListItemStore()
    cursor: null | number = null;
    ovverrideMode: boolean = false;

    constructor(label: string) {
        this.label = label;
        this.showOnTimeline = false;
    }

    addEvent(event: StoreEvent): StoreEvent {
        this.events.push(event)
        this.store.actions.setEventsCount(this.events.length)
        return event
    }

    total(): number {
        return this.events.length
    }

    getLatest(): StoreEvent | null {
        this.cursor = Math.max(this.events.length - 1, 0)
        return this.getSelected()
    }

    getCursor(): number {
        return this.cursor = this.cursor ?? Math.max(this.events.length - 1, 0)
    }

    getSelected(): StoreEvent | null {
        return this.getBy(this.getCursor())
    }

    hasNext(): boolean {
        return this.getCursor() < (this.events.length - 1)
    }

    next(): StoreEvent | null {
        if (this.hasNext()) {
            return this.getBy(++this.cursor!)
        }
        return null
    }

    hasPrevious(): boolean {
        return this.getCursor() > 0
    }

    previous(): StoreEvent | null {
        if (this.hasPrevious()) {
            return this.getBy(--this.cursor!)
        }
        return null
    }

    getBy(index: number): StoreEvent | null {
        return this.events[index]
    }
}

class StorageController {
    storagesRegistry: Map<string, Mute8Storage> = new Map();
    selected: Mute8Storage | null = null;

    // Utils
    getMute8ViewStore(label: string): Mute8StoreInstance {
        return this.getOrCreateStorage(label).store
    }

    getOrCreateStorage(storageLabel: string): Mute8Storage {
        if (this.selected?.label == storageLabel) {
            return this.selected;
        }

        const inRegistry = this.storagesRegistry.get(storageLabel)
        if (!!inRegistry) {
            return inRegistry
        }
        const storage = new Mute8Storage(storageLabel);
        this.storagesRegistry.set(storageLabel, storage)
        storageList.actions.updateAll(this.storagesRegistry)
        return storage
    }

    // Hanlde Incoming Data
    resetState() {
        this.storagesRegistry = new Map()
        storageList.actions.updateAll(this.storagesRegistry)
        this.selectStore(null)
        this.selectEvent(null)
    }
    addStorageDefs(defs: Types.StorageDefintion[]) {
        for (let def of defs) {
            this.getOrCreateStorage(def.label)
        }
        storageList.actions.updateAll(this.storagesRegistry)
    }
    pushStorageEvent(lable: string, event: StoreEvent) {
        const storage = this.getOrCreateStorage(lable);
        const newEvent = storage.addEvent(event)

        if (storage.label === this.selected?.label) {
            topControls.actions.updateStatus(this.selected)
            timelineRender.addEvent(newEvent)
        }
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
        this.selected = this.storagesRegistry.get(l) ?? null
        if (this.selected) {
            this.selected.store.actions.setSelected(true)
            this.selectEvent(this.selected.getSelected())
            timelineRender.renderAll(this.selected.events)
        }
    }
    nextEvent() {
        if (!this.selected) return
        if (this.selected.hasNext()) {
            this.selectEvent(this.selected.next())
        }
    }
    previousEvent() {
        if (!this.selected) return
        if (this.selected.hasPrevious()) {
            this.selectEvent(this.selected.previous())
        }
    }
    latestEvent() {
        if (!this.selected) return
        if (this.selected.hasPrevious()) {
            this.selectEvent(this.selected.getLatest())
        }
    }
    private selectEvent(event: StoreEvent | null) {
        if (this.selected && this.selected.ovverrideMode && event) {
            overrideController.setOverride(this.selected.label, true, event)
        }
        this.updateSelectedPreview()
    }
    filterList(phrase: string): void {
        storageList.actions.filter(phrase)
    }
    updateSelectedPreview() {
        eventPreviewDisplay(this.selected?.getSelected() ?? null)
        topControls.actions.updateStatus(this.selected)
    }
}

export const storageController = new StorageController()