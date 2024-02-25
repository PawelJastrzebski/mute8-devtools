import { JSXElement } from "solid-js";
import { newVirtualizer } from "../utils/Virtualizer";
import { StoreEvent } from "./StoregeEvent";
import timestamp from "time-stamp";
import { overrideController } from "./OverrideController";
import { storageController } from "./StorageController";


class EventsListController {
    events: StoreEvent[] = []
    readonly virtualizer = newVirtualizer<number>({
        height: 42,
        renderItem: this.renderEvent.bind(this)
    });

    reset() {
        this.events = []
        this.virtualizer.setItems([])
    }

    addEvent(event: StoreEvent) {
        const index = (this.events.push(event) - 1)
        this.virtualizer.unshift(index)
    }

    renderEvent(index: number): JSXElement {
        const event = this.events[index]
        const t = timestamp("HH:mm:ss ms", new Date(event.time))
        const overrided = overrideController.isOverridedById(event.id)

        let label = <>{event.label}.{event.type}</>
        if (event.type == "change") {
            label = <>{event.label}.{event.actionName}</>
        }

        const onClick = () => {
            if (overrided) {
                overrideController.setOverride(event.label, false)
            } else {
                overrideController.setOverride(event.label, true, event)
                if (storageController.selected && storageController.selected.label != event.label) {
                    storageController.selectStore(event.label)
                }
            }
        }

        return <div onclick={onClick} classList={{ "event-list-item": true, "overrided": overrided }}>
            <div class="e-label">{label}</div>
            <div class="e-right">
                {/* <div class="e-type">{event.type}</div> */}
                <div class="e-time">{t}</div>
            </div>
        </div>
    }
}

export const eventsListController = new EventsListController()