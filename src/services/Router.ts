import { LocalStoragePlugin } from "mute8-plugins";
import { newStore } from "mute8-solid"
import { eventsListController } from "./EventsListController";
import { goToSelectedEventStatck } from "../components/panel/EventList";

type SideBarVersion = "visible" | "hidden" | "none"
type TopBarVersion = "big" | "small"
type View = "home" | "panel"

export const router = newStore({
    value: {
        view: "panel" as View,
        topBarVersion: "small" as TopBarVersion,
        footerVersion: "small" as TopBarVersion,
        sideBarVersion: "big" as SideBarVersion,
        eventStackVersion: "small" as SideBarVersion,
        isConnected: false
    },
    actions: {
        navigate(view: View) {
            this.view = view;
        },
        setConnected(isConnected: boolean) {
            this.isConnected = isConnected;
            if (isConnected == false) {
                this.sideBarVersion = "none"
                this.eventStackVersion = "none"
                this.footerVersion = "big"
                this.topBarVersion = "big"
            } else {
                this.topBarVersion = "small"
                this.footerVersion = "small"
            }

            if (isConnected && this.sideBarVersion == "none") {
                this.sideBarVersion = "visible"
            }
            if (isConnected && this.eventStackVersion == "none") {
                this.eventStackVersion = "hidden"
            }
        },
        setTopBarVersion(big: boolean) {
            this.topBarVersion = big ? "big" : "small";
        },
        setFooterVersion(big: boolean) {
            this.footerVersion = big ? "big" : "small";
        },
        setSodebarVersion(version: SideBarVersion) {
            this.sideBarVersion = version;
        },
        setEventStackVersion(version: SideBarVersion) {
            this.eventStackVersion = version;
            eventsListController.virtualizer.rerender()
            setTimeout(goToSelectedEventStatck, 15)
        }
    },
    plugin: LocalStoragePlugin.new("router-store")
})

// Navigation
export const useView = () => router.solid.useOne("view");
export const navigate = (view: View) => router.actions.navigate(view);
// UI
export const toggleTopBar = () => router.actions.setTopBarVersion(!(router.topBarVersion == "big"))
export const toggleFooter = () => router.actions.setFooterVersion(!(router.footerVersion == "big"))

export const toogleSideBar = () => {
    if (router.sideBarVersion == "none") return
    router.actions.setSodebarVersion(router.sideBarVersion === "hidden" ? "visible" : "hidden")
}

export const toogleEventStackVersion = () => {
    if (router.eventStackVersion == "none") return
    router.actions.setEventStackVersion(router.eventStackVersion === "hidden" ? "visible" : "hidden")
}