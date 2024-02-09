import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { newStore } from "mute8-solid";
import { displayEvent, monacoEditor, toJsonPritty } from "./MonacoEditor";

// Event Preview
export const eventPreview = newStore({
    value: {
        event: null as StoreEvent | null,
    },
    actions: {
        setEvent(event: StoreEvent | null) {
            this.event = event
            console.log(event)
        }
    }
})

// SideBar View
interface StorageListItem {
    label: string
    showOnTimeline: boolean
}
export const storageList = newStore({
    value: {
        filterPhrase: "",
        list: [] as StorageListItem[]
    },
    actions: {
        updateAll(storagesRegistry: Map<string, Storage>) {
            this.list = Array.from(storagesRegistry.values()).map(storage => {
                return {
                    label: storage.label,
                    showOnTimeline: storage.showOnTimeline
                }
            })
        },
        filter(phrase: string) {
            this.filterPhrase = phrase;
        }
    }
})

const createStorageStore = () => {
    return newStore({
        value: {
            events: 0,
            selected: false
        },
        actions: {
            incrementEventsCount(value = 1) {
                this.events = this.events + value
            },
            setSelected(selected: boolean) {
                this.selected = selected;
            }
        }
    })
}
type StatsStore = ReturnType<typeof createStorageStore>;

// Logic
interface InitStateEvent {
    type: "init-state"
    state: object
    time: number
}

interface ChangeStateEvent {
    type: "change-state"
    oldState: object
    newState: object,
    time: number
}

export type StoreEvent = InitStateEvent | ChangeStateEvent

class Storage {
    label: string
    showOnTimeline: boolean
    events: Array<StoreEvent> = []
    store: StatsStore = createStorageStore()
    constructor(label: string) {
        this.label = label;
        this.showOnTimeline = false;
    }

    getEvent(): StoreEvent | null {
        // todo sort by timestamp
        return this.events[this.events.length - 1]
    }
}

class StorageController {
    storagesRegistry: Map<string, Storage> = new Map();
    selected: Storage | null = null;
    resetState() {
        this.storagesRegistry = new Map()
        storageList.actions.updateAll(this.storagesRegistry)
    }
    addStorageDefs(defs: Types.StorageDefintion[]) {
        for (let def of defs) {
            this.getOrCreateStorage(def.label)
        }
        storageList.actions.updateAll(this.storagesRegistry)
    }
    getOrCreateStorage(storageLabel: string): Storage {
        const inRegistry = this.storagesRegistry.get(storageLabel)
        if (!!inRegistry) {
            return inRegistry
        }
        const storage = new Storage(storageLabel);
        this.storagesRegistry.set(storageLabel, storage)
        storageList.actions.updateAll(this.storagesRegistry)
        return storage
    }
    pushInitState(data: Types.InitState) {
        const storage = this.getOrCreateStorage(data.storageLabel);
        const event: InitStateEvent = {
            type: "init-state",
            state: data.state,
            time: data.time
        }
        storage.events.push(event)
        storage.store.actions.incrementEventsCount()
    }
    pushChnageState(data: Types.ChangeState) {
        const storage = this.getOrCreateStorage(data.storageLabel);
        const event: ChangeStateEvent = {
            type: "change-state",
            oldState: data.oldState,
            newState: data.newState,
            time: data.time
        }
        storage.events.push(event)
        storage.store.actions.incrementEventsCount()
    }
    public getStore(label: string): StatsStore {
        return this.getOrCreateStorage(label).store
    }
    select(label: string | null = this.selected?.label ?? null) {
        const l = label ?? "";

        // unselect
        if (this.selected) {
            // if (this.selected.label == l) return;
            this.selected.store.actions.setSelected(false)
        }
        // select
        this.selected = this.storagesRegistry.get(l) ?? null
        if (this.selected) {
            this.selected.store.actions.setSelected(true)
            const e = this.selected.getEvent();
            eventPreview.actions.setEvent(e)
            displayEvent(e)
        }
    }
    filter(phrase: string): void {
        storageList.actions.filter(phrase)
    }
}

export const storageController = new StorageController()