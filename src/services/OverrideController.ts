import { topControls } from "../components/panel/TimelineTopControls";
import { hostConnector, StateOverrides } from "./ClientConnector";
import { storageController } from "./StorageController";

// StoreEvent or Override
type StateHollder = { state: object }

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

    setOverride(label: string, enable?: boolean, event?: StateHollder): void {
        const store = storageController.getOrCreateStorage(label)
        const eventValue = event ?? store.getLatest()
        const enableValue = enable ?? !store.ovverrideMode;
        console.log(store, enableValue)
        if (enableValue && eventValue) {
            this.overrides[label] = { state: eventValue.state }
            store.ovverrideMode = true;
            store.store.actions.setOvveridMode(true)
        } else {
            delete this.overrides[label]
            store.ovverrideMode = false;
            store.store.actions.setOvveridMode(false)
        }

        if (storageController.selected && storageController.selected.label == store.label) {
            topControls.actions.updateStatus(store)
        }
        hostConnector.setOverrides(this.overrides)
    }

}


export const overrideController = new OverrideController();