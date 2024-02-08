import { WindowDialog } from "cors-window"
import { DevToolsPrivateTypes as Types } from "mute8-plugins"

class ClientController {
    readonly dialog = new WindowDialog("devtools")
    constructor() {
        this.dialog.onMessage = this.handleMessage.bind(this)
        setInterval(() => {
            this.dialog.post({ test: "OK" })
        }, 4000)
    }
    handleMessage(payload: Types.Payload) {
        if (payload["storage-definitions"]) {
            console.log("defs", payload["storage-definitions"])
        }
        if (payload["devtools-options"]) {
            console.log("options", payload["devtools-options"])
        }
        if (payload["storage-state-init"]) {
            console.log("init", payload["storage-state-init"])
        }
        if (payload["storage-state-changed"]) {
            console.log("change", payload["storage-state-changed"])
        }
    }
    sendCommand(type: Types.Payload['host-command']) {
        const payload: Types.Payload = {
            "host-command": type
        }
        this.dialog?.post(payload)
    }
}

export const clientController = new ClientController()