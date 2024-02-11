import { WindowDialog } from "cors-window"
import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { storageController } from "./StorageController"
import { timelineRender } from "./TimelineRender"

class ClientController {
    dialog: WindowDialog<Types.Payload[]> | null = null
    constructor() {
        setTimeout(() => {
            this.dialog = new WindowDialog("devtools");
            this.dialog.onMessage = (data) => this.handleMessage(data as object[])
        }, 10)
    }
    handleMessage(list: Types.Payload[]) {
        for (const p of list) {
            if (p.init) {
                storageController.resetState()
                timelineRender.clear()
            } else if (p.storageDefinitions) {
                storageController.addStorageDefs(p.storageDefinitions)
                console.log("defs")
            } else if (p.devtoolsOptions) {
                console.log("options", p.devtoolsOptions)
            } else if (p.stateInit) {
                storageController.pushInitState(p.stateInit)
            } else if (p.stateChanged) {
                storageController.pushChnageState(p.stateChanged)
            }
        }
    }

    setOverrides(overrides: Record<string, Types.OverrideState> | {}) {
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

export const clientController = new ClientController()