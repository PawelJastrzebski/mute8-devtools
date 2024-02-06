class ClientController {
    readonly isConnected: boolean = false;
    private opener: Window;
    constructor() {
        this.opener = window.opener;
        this.isConnected = !!this.opener;
    }
}

export const clientController = new ClientController()