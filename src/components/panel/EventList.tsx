import "./EventList.scss"
import { eventsListController } from "../../services/EventsListController";
import { newStore } from "mute8-solid";
import Icon from "../Icon";
import { storageController } from "../../services/StorageController";
import { LocalStoragePlugin } from "mute8-plugins";

const goToSelected = () => {
    if (eventListStore.visible && storageController.selected) {
        const event = storageController.selected.getSelected()
        if (event) eventsListController.virtualizer.scrollTo(event.id)
    }
}

const eventListStore = newStore({
    value: {
        visible: false
    },
    actions: {
        toggle() {
            this.visible = !this.visible
            eventsListController.virtualizer.rerender()
            setTimeout(goToSelected, 15)
        }
    },
    plugin: LocalStoragePlugin.new("event-list-state")
})
export const toggleEventList = () => eventListStore.actions.toggle();
const scrollUp = () => { eventsListController.scrollTop() }
const scrollDown = () => { eventsListController.scrollBottom() }

export function CloseEventListIcon() {
    const enabled = eventListStore.solid.select(v => v.visible)
    return <div style={{ "display": enabled() ? "none" : "flex" }}>
        <Icon data-tooltip-left="Events Stack" size={20} iconName={() => "list"} onClick={toggleEventList} />
    </div>
}


export function EventList() {
    const diabled = eventListStore.solid.select(v => !v.visible)
    const list = eventsListController.virtualizer.getList()()
    return (
        <div classList={{ "event-list": true, "disabled": diabled() }}>
            <div class="header top-bar-style">
                <span>Events Stack</span>
                <div class="icons">
                    <Icon data-tooltip-left="Scroll Down" size={20} iconName={() => "down"} onClick={scrollDown} />
                    <Icon data-tooltip-left="Scroll Up" size={20} iconName={() => "up"} onClick={scrollUp} />
                    <Icon data-tooltip-left="Events Stack" size={20} iconName={() => "close"} onClick={toggleEventList} />
                </div>
            </div>
            <div class="body">
                {list}
            </div>
        </div>
    )
}