import "./EventList.scss"
import { eventsListController } from "../../services/EventsListController";
import Icon from "../Icon";
import { storageController } from "../../services/StorageController";
import { router, toogleEventStackVersion } from "../../services/Router";

export const goToSelectedEventStatck = () => {
    if (router.eventStackVersion !== "visible") return

    if (storageController.selected) {
        const event = storageController.selected.getSelected()
        if (event) eventsListController.virtualizer.scrollTo(event.id)
    } else {
        eventsListController.selectCurrent()
    }
}


const scrollUp = () => { eventsListController.scrollTop() }
const scrollDown = () => { eventsListController.scrollBottom() }

export function CloseEventListIcon() {
    const enabled = router.solid.select(v => v.eventStackVersion === "visible")
    return <div style={{ "display": enabled() ? "none" : "flex" }}>
        <Icon
            data-tooltip-left="Events Stack (E)"
            size={20} iconName={() => "list"}
            onClick={toogleEventStackVersion}
        />
    </div>
}

export function EventList() {
    const evnetStackClass = router.solid.select(v => v.eventStackVersion)
    const list = eventsListController.virtualizer.getList()()
    return (
        <div class={`event-list ${evnetStackClass()}`} >
            <div class="header top-bar-style">
                <span>Events Stack</span>
                <div class="icons">
                    <Icon data-tooltip-left="Scroll Down" size={20} iconName={() => "down"} onClick={scrollDown} />
                    <Icon data-tooltip-left="Scroll Up" size={20} iconName={() => "up"} onClick={scrollUp} />
                    <Icon data-tooltip-left="Close (E)" size={20} iconName={() => "close"} onClick={toogleEventStackVersion} />
                </div>
            </div>
            <div class="body">
                {list}
            </div>
        </div>
    )
}