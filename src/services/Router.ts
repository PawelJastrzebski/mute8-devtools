import { newStore } from "mute8-solid"

type View = "home" | "panel"
export const router = newStore({
    value: {
        view: "panel" as View,
        isConnected: false
    },
    actions: {
        navigate(view: View) {
            this.view = view;
        },
        setConnected(isConnected: boolean) {
            this.isConnected = isConnected;
        }
    }
})

export const useView = () => router.solid.useOne("view");
export const navigate = (view: View) => router.actions.navigate(view);