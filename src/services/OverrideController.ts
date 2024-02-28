import { storeFullPreview } from "../components/panel/FullStatePreview";
import { hostConnector, StateOverrides } from "./ClientConnector";
import { storageController } from "./StorageController";

// StoreEvent or Override
type StateHolder = { id: number, state: object }

class OverrideController {
    private overrides: StateOverrides = {}
    constructor() {

    }
    setInit(overrides: StateOverrides) {
        this.overrides = overrides
        for (const [label, override] of Object.entries(this.overrides)) {
            this.setOverride(label, true, override)
        }
    }

    isOverrided(label: string): boolean {
        return !!this.overrides[label]
    }

    isOverridedById(eventId: number): boolean {
        return !!Object.values(this.overrides).find(v => v.id == eventId)
    }

    setOverride(label: string, enable?: boolean, stateHolder?: StateHolder): void {
        const store = storageController.getOrCreateStorage(label)
        const enableValue = enable ?? !store.overrided;
        const canBeEnabled = (store.total() > 0 || !!stateHolder);
        const eventValue = stateHolder ?? store.getSelected() ?? store.getLast()!;
        if (enableValue && canBeEnabled) {
            this.overrides[label] = { id: eventValue.id, state: eventValue.state }
        } else {
            delete this.overrides[label]
        }

        // notify host
        hostConnector.setOverrides(this.overrides)

        // update view
        store.overrided = enableValue;
        store.store.actions.setOverride(enableValue)
        store.setCursorById(eventValue.id)
        storageController.updateSelectedPreview()
        storeFullPreview.actions.updateStoreState(label, eventValue.state, false);
    }

}

export const overrideController = new OverrideController();