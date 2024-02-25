import "./EventList.scss"
import { eventsListController } from "../../services/EventsListController";
export function EventList() {
    const list = eventsListController.virtualizer.getList()()
    return (
        <div class="event-list">
            <div class="header">
                <span>Event List</span>
            </div>
            <div class="body">
                {list}
            </div>
        </div>
    )
}