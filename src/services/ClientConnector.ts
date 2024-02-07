import { WindowDialog } from "cors-window"

class ClientController {
    readonly dialog = new WindowDialog("devtools")
    constructor() {
        this.dialog.onMessage = (msg) => {
            console.log(msg)
        }
        setInterval(() => {
            this.dialog.post({test: "OK"})
        }, 1500)
    }
}

export const clientController = new ClientController()