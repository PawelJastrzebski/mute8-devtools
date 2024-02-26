import "./EventList.scss"
import { eventsListController } from "../../services/EventsListController";
import { newStore } from "mute8-solid";
import Icon from "../Icon";

const eventListStore = newStore({
    value: {
        visible: false
    },
    actions: {
        toggle() {
            this.visible = !this.visible
            eventsListController.virtualizer.rerender()
        }
    }
})
const toggle = () => eventListStore.actions.toggle();

export function CloseEventListIcon() {
    const enabled = eventListStore.solid.select(v => v.visible)
    return <div style={{ "display": enabled() ? "none" : "flex" }}>
        <Icon data-tooltip-left="Event List" size={20} iconName={() => "list"} onClick={toggle} />
    </div>
}


export function EventList() {
    const diabled = eventListStore.solid.select(v => !v.visible)
    const list = eventsListController.virtualizer.getList()()
    return (
        <div classList={{ "event-list": true, "disabled": diabled() }}>
            <div class="header top-bar-style">
                <span>Event List</span>
                <Icon size={20} iconName={() => "close"} onClick={toggle} />
            </div>
            <div class="body">
                {list}
            </div>
        </div>
    )
}