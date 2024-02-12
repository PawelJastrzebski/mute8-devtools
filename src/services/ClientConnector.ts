import { WindowDialog } from "cors-window"
import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { storageController } from "./StorageController"
import { overrideController } from "./OverrideController";
import { router } from "./Router";

export type StateOverrides = Record<string, Types.OverrideState>;

class HostConnector {
    dialog: WindowDialog<Types.Payload[]> | null = null
    constructor() {
        setTimeout(this.init.bind(this), 10)
    }

    init() {
        console.log(this.dialog)

        if (this.dialog) return;

        this.dialog = new WindowDialog("devtools");
        this.dialog.onMessage = (data) => this.handleMessage(data as object[])
        router.actions.setConnected(this.dialog.isOpen())
    }

    handleMessage(list: Types.Payload[]) {
        for (const p of list) {
            if (p.init) {
                storageController.init(p.init)
            } else if (p.devtoolsOptions) {
                // todo
            } else if (p.stateInit) {
                storageController.pushStorageEvent(p.stateInit.storageLabel, {
                    type: "init-state",
                    state: p.stateInit.state,
                    time: p.stateInit.time
                })
            } else if (p.stateChanged) {
                storageController.pushStorageEvent(p.stateChanged.storageLabel, {
                    type: "change-state",
                    oldState: p.stateChanged.oldState,
                    state: p.stateChanged.newState,
                    time: p.stateChanged.time
                })
            } else if (p.stateOverrides) {
                overrideController.setInit(p.stateOverrides)
            }
        }
    }

    setOverrides(overrides: StateOverrides) {
        this.dialog?.post([{
            stateOverrides: overrides
        }])
    }

    sendCommand(type: Types.Payload["hostCommand"]) {
        this.dialog?.post([{
            hostCommand: type
        }])
    }
}

export const hostConnector = new HostConnector()