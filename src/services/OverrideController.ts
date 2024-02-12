import { hostConnector, StateOverrides } from "./ClientConnector";
import { storageController } from "./StorageController";

// StoreEvent or Override
type StateHolder = { state: object }

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

    setOverride(label: string, enable?: boolean, stateHolder?: StateHolder): void {
        const store = storageController.getOrCreateStorage(label)
        const enableValue = enable ?? !store.overrided;
        const canBeEnabled = (store.total() > 0 || !!stateHolder);
        if (enableValue && canBeEnabled) {
            const eventValue = stateHolder ?? store.getLast()!
            this.overrides[label] = { state: eventValue.state }
        } else {
            delete this.overrides[label]
        }

        // notify host
        hostConnector.setOverrides(this.overrides)

        // update view
        store.overrided = enableValue;
        store.store.actions.setOverride(enableValue)
        storageController.updateSelectedPreview()
    }

}

export const overrideController = new OverrideController();