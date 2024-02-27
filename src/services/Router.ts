import { LocalStoragePlugin } from "mute8-plugins";
import { newStore } from "mute8-solid"

type TopBarVersion = "big" | "small"
type View = "home" | "panel"

export const router = newStore({
    value: {
        view: "panel" as View,
        topBarVersion: "small" as TopBarVersion,
        footerVersion: "small" as TopBarVersion,
        isConnected: false
    },
    actions: {
        navigate(view: View) {
            this.view = view;
        },
        setConnected(isConnected: boolean) {
            this.isConnected = isConnected;
        },
        setTopBarVersion(big: boolean) {
            this.topBarVersion = big ? "big" : "small";
        },
        setFooterVersion(big: boolean) {
            this.footerVersion = big ? "big" : "small";
        }
    },
    plugin: LocalStoragePlugin.new("router-store")
})

// Navigation
export const useView = () => router.solid.useOne("view");
export const navigate = (view: View) => router.actions.navigate(view);
// TopBar
export const setTopBarVersion = (big: boolean) => router.actions.setTopBarVersion(big)
export const toggleTopBar = () => router.actions.setTopBarVersion(!(router.topBarVersion == "big"))
// Footer
export const setFooterVersion = (big: boolean) => router.actions.setFooterVersion(big)
export const toggleFooter = () => router.actions.setFooterVersion(!(router.footerVersion == "big"))