import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { newStore } from "mute8-solid";

// View
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

const createStorageStats = () => {
    return newStore({
        value: {
            events: 0,
        },
        actions: {
            incrementEventsCount(value = 1) {
                this.events = this.events + value
            }
        }
    })
}
type StatsStore = ReturnType<typeof createStorageStats>;

// Logic
interface InitStateEvent {
    type: "init-state"
    state: object
}

interface ChangeStateEvent {
    type: "change-state"
    oldState: object
    newState: object
}

type Event = InitStateEvent | ChangeStateEvent

class Storage {
    label: string
    showOnTimeline: boolean
    events: Array<Event> = []
    statsStore: StatsStore = createStorageStats()
    constructor(label: string) {
        this.label = label;
        this.showOnTimeline = false;
    }
}

class StorageController {
    storagesRegistry: Map<string, Storage> = new Map();
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
            state: data.state
        }
        storage.events.push(event)
        storage.statsStore.actions.incrementEventsCount()
    }
    pushChnageState(data: Types.ChangeState) {
        const storage = this.getOrCreateStorage(data.storageLabel);
        const event: ChangeStateEvent = {
            type: "change-state",
            oldState: data.oldState,
            newState: data.newState
        }
        storage.events.push(event)
        storage.statsStore.actions.incrementEventsCount()
    }
    public getStatsStore(label: string): StatsStore {
        const storage = this.getOrCreateStorage(label);
        return storage.statsStore
    }

    filter(phrase: string): void {
        storageList.actions.filter(phrase)
    }
}

export const storageController = new StorageController()