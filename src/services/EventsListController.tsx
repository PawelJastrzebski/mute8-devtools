import { JSXElement } from "solid-js";
import { newVirtualizer } from "../utils/Virtualizer";
import { StoreEvent } from "./StoregeEvent";
import timestamp from "time-stamp";
import { overrideController } from "./OverrideController";
import { storageController } from "./StorageController";
import Icon from "../components/Icon";
import { JsonView } from "../components/JsonView";

class EventsListController {
    events: StoreEvent[] = []
    selected: StoreEvent | null = null
    readonly virtualizer = newVirtualizer({
        height: 42,
        updateMs: 300,
        bottomPadding: 0.9,
        renderItem: this.renderEvent.bind(this)
    });

    reset() {
        this.events = []
        this.virtualizer.setItems([])
        this.virtualizer.rerender()
    }

    addEvent(event: StoreEvent) {
        const index = (this.events.push(event) - 1)
        this.virtualizer.unshift(index)
    }

    renderEvent(index: number): JSXElement {
        const event = this.events[index]
        const time = timestamp("HH:mm:ss ms", new Date(event.time))
        const overrided = overrideController.isOverridedById(event.id)
        const isSelected = storageController.isSelectedById(event.label, event.id)
        const actionDescription = event.type == "change" ? event.actionName ?? "mut(..)" : event.type;
        const label = <><span class="e-type">{event.label}</span>.{actionDescription}</>

        let expnadedNode = <></>
        if (this.selected?.id == event.id) {
            const data = event.type == "change" ? event.args ?? [] : event.state;
            expnadedNode = (<div class="expanded">
                <JsonView
                    id={event.id + "-args-preview"}
                    preview={false}
                    expand={"0"}
                    data={() => data} />
            </div>)
        }

        const onClick = () => {
            if (overrided) {
                overrideController.setOverride(event.label, false)
            } else {
                overrideController.setOverride(event.label, true, event)
            }
        }

        const onSelect = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            this.selected?.id == event.id ? this.selected = null : this.selected = event;
            this.virtualizer.rerender()
        }

        return (<>
            <div classList={{ "event-list-item": true, "overrided": overrided, "selected": isSelected  }}>
                <div class="top">
                    <div class="e-label" onclick={onClick}>
                        {label}
                    </div>
                    <div class="e-time">
                        <div class="time-value">
                            {time}
                            <Icon onClick={onSelect} iconName={() => 'expand-more'} />
                        </div>
                    </div>
                </div>
                {expnadedNode}
            </div>
        </>)
    }
}

export const eventsListController = new EventsListController()