import { WindowDialog } from "cors-window"
import { DevToolsPrivateTypes as Types } from "mute8-plugins"
import { storageController } from "./StorageController"

class ClientController {
    dialog: WindowDialog | null = null
    constructor() {
        setTimeout(() => {
            this.dialog = new WindowDialog("devtools");
            this.dialog.onMessage = (data) => this.handleMessage(data as object[])
        }, 10)
    }
    handleMessage(list: Types.Payload[]) {
        for (const p of list) {
            if (p["init"]) {
                storageController.resetState()
                console.log("init")
            } else if (p["storage-definitions"]) {
                storageController.addStorageDefs(p["storage-definitions"])
                console.log("defs")
            } else if (p["devtools-options"]) {
                console.log("options", p["devtools-options"])
            } else if (p["storage-state-init"]) {
                storageController.pushInitState(p["storage-state-init"])
            } else if (p["storage-state-changed"]) {
                storageController.pushChnageState(p["storage-state-changed"])
            }
        }
    }
    sendCommand(type: Types.Payload['host-command']) {
        const payload: Types.Payload = {
            "host-command": type
        }
        this.dialog?.post([payload])
    }
}

export const clientController = new ClientController()