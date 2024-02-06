import { newStore } from "mute8-solid"
import { clientController } from "./ClientConnector";


type View = "home" | "panel"
const router = newStore({
    value: {
        view: "home" as View
    },
    actions: {
        navigate(view: View) {
            this.view = view;
        }
    }
})

export const useView = () => router.solid.useOne("view");
export const navigate = (view: View) => router.actions.navigate(view);

(() => {
    if (clientController.isConnected) {
        navigate("panel")
    }
})()