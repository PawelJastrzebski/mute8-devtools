import { JSXElement } from "solid-js";
import { newVirtualizer } from "../utils/Virtualizer";
import { StoreEvent } from "./StoregeEvent";
import timestamp from "time-stamp";
import { overrideController } from "./OverrideController";
import { storageController } from "./StorageController";
import Icon from "../components/Icon";
import { JsonView } from "../components/JsonView";

class EventsListController {
    readonly virtualizer = newVirtualizer({
        height: 42,
        updateMs: 300,
        bottomPadding: 0.8,
        renderItem: this.renderEvent.bind(this)
    });
    private events: StoreEvent[] = []
    private expnadedEvent: StoreEvent | null = null
    private selectedEvent: StoreEvent | null = null

    // event selector pointer

    private getSelectedCursor(): number | null {
        return !!this.selectedEvent ? this.events.indexOf(this.selectedEvent) : null;
    }

    rewind(moveBy: number, scrollTo: boolean = true) {
        console.log('rewind', moveBy)
        const cursor = this.getSelectedCursor() ?? this.events.length - 1;
        let next = cursor + moveBy;
        if (next > this.events.length) next = this.events.length - 1;
        if (next < 0) next = 0;
        this.selectEventByIndex(next, scrollTo)
    }

    selectNext(scrollTo: boolean = true) {
        this.rewind(+1, scrollTo)
    }

    selectPrevious(scrollTo: boolean = true,) {
        this.rewind(-1, scrollTo)
    }

    selectEventByIndex(index: number, scrollTo: boolean = true) {
        const last = this.events[index];
        !!last && this.selectEvent(last, scrollTo)
    }

    selectEvent(event: StoreEvent | null, scrollTo: boolean = true) {
        this.selectedEvent = event
        if (this.selectedEvent && scrollTo) {
            this.virtualizer.scrollTo(this.events.indexOf(this.selectedEvent) + 1)
        }
    }

    toggleOverrideSelected() {
        if (!this.selectedEvent) return
        this.toggleOverride(this.selectedEvent)
    }

    toggleOverride(event: StoreEvent) {
        const overrided = overrideController.isOverridedById(event.id)
        if (overrided) {
            overrideController.setOverride(event.label, false)
        } else {
            overrideController.setOverride(event.label, true, event)
        }
    }

    isSelected(event: StoreEvent) {
        if (!!storageController.selected) {
            return storageController.isSelectedById(event.label, event.id)
        } else {
            return this.selectedEvent?.id == event.id;
        }
    }

    isOvverrided(event: StoreEvent) {
        return overrideController.isOverridedById(event.id)
    }

    // scroll & list

    reset() {
        this.events = []
        this.virtualizer.setItems([])
    }
    addEvent(event: StoreEvent) {
        const index = (this.events.push(event) - 1)
        this.virtualizer.unshift(index)
    }
    scrollBottom() {
        this.virtualizer.scrollBottom()
    }
    scrollTop() {
        this.virtualizer.scrollTop()
    }
    renderEvent(index: number): JSXElement {
        const event = this.events[index]
        const time = timestamp("HH:mm:ss ms", new Date(event.time))
        const actionDescription = event.type == "change" ? event.actionName ?? "mut(..)" : event.type;
        const label = <><span class="e-type">{event.label}</span>.{actionDescription}</>

        let expnadedNode = <></>
        if (this.expnadedEvent?.id == event.id) {
            const data = event.type == "change" ? event.args ?? [] : event.state;
            expnadedNode = (
                <div class="expanded">
                    <JsonView
                        id={event.id + "-args-preview"}
                        preview={false}
                        expand={"0"}
                        data={() => data} />
                </div>
            )
        }

        const onExpand = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            this.expnadedEvent?.id == event.id ? this.expnadedEvent = null : this.expnadedEvent = event;
            this.virtualizer.rerender()
        }

        const style = { "event-list-item": true, "overrided": this.isOvverrided(event), "selected": this.isSelected(event) }
        return (
            <div onclick={() => this.selectEvent(event, false)} classList={style}>
                <div class="top">
                    <div class="e-label">
                        {label}
                    </div>
                    <div class="e-time">
                        <div class="time-value">
                            {time}
                            <Icon data-tooltip-left-flat="Show call arguments" onClick={onExpand} iconName={() => 'expand-more'} />
                        </div>
                    </div>
                </div>
                {expnadedNode}
            </div>
        )
    }
}

export const eventsListController = new EventsListController()