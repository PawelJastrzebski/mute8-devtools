import { WindowDialog } from "cors-window"
import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { storageController } from "./StorageController"
import { overrideController } from "./OverrideController";
import { router, setFooterVersion, setTopBarVersion } from "./Router";

export type StateOverrides = Record<string, Types.OverrideState>;

class HostConnector {
    dialog: WindowDialog<Types.Payload[]> | null = null
    constructor() {
        setTimeout(this.init.bind(this), 10)
    }

    init() {
        if (this.dialog && this.dialog.isOpen()) {
            return
        }

        this.dialog = new WindowDialog("devtools");
        this.dialog.onMessage = (data) => this.handleMessage(data as object[])
        router.actions.setConnected(this.dialog.isOpen())
        setTopBarVersion(!this.dialog.isOpen())
        setFooterVersion(!this.dialog.isOpen())
    }

    handleMessage(list: Types.Payload[]) {
        for (const p of list) {
            if (p.init) {
                storageController.init(p.init)
            } else if (p.devtoolsOptions) {
                // todo
            } else if (p.stateInit) {
                const i = p.stateInit;
                storageController.pushStorageEvent(i.storageLabel, {
                    id: i.id,
                    label: i.storageLabel,
                    type: "init",
                    state: i.state,
                    time: i.time
                })
            } else if (p.stateChanged) {
                const c = p.stateChanged;
                storageController.pushStorageEvent(c.storageLabel, {
                    id: c.id,
                    label: c.storageLabel,
                    type: "change",
                    oldState: c.oldState,
                    state: c.state,
                    actionName: c.actionName,
                    args: c.args,
                    time: c.time
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

export const refreshHostApp = () => hostConnector.sendCommand("refresh-host");