import "./EventPreview.scss"
import { createMemo } from "solid-js"
import { setSelectedMute8StoreCache, storageController } from "../../services/StorageController"
import timestamp from "time-stamp"
import TimelineTopControls, { topControls } from "./TimelineTopControls"
import { newStore } from "mute8-solid"
import Icon from "../Icon"
import { FullStatePreview } from "./FullStatePreview"
import { StoreEvent } from "../../services/StoregeEvent"
import { CloseEventListIcon, EventList } from "./EventList"

export const eventPreview = newStore({
    value: {
        event: null as StoreEvent | null,
    },
    actions: {
        setEvent(event: StoreEvent | null) {
            this.event = event
        }
    }
})

function MonacoEditorPreview() {
    const [event,] = eventPreview.solid.useOne("event")
    const [cursor,] = topControls.solid.useOne("cursor")
    const [total,] = topControls.solid.useOne("total")

    const eventInfo = createMemo(() => {
        const e = event()
        if (!e) return <></>;
        const t = timestamp("HH:mm:ss ms", new Date(e.time))
        return (
            <>
                <div data-tooltip="Selected/Total" class="stats">{cursor()}/{total()}</div>
                <div data-tooltip="Event Type" class="type-info wrapper">{e.type}</div>
                <div data-tooltip="Event Timestamp" class="timestamp wrapper">{t}ms</div>
            </>
        )
    })

    const onClose = () => {
        storageController.selectStore(null);
        setSelectedMute8StoreCache(null);
    }

    return (
        <>
            <div class="top top-bar-style">
                <TimelineTopControls />
                <div class="event-info">
                    {eventInfo()}
                </div>
                <div class="right-icons">
                    <Icon data-tooltip-left="Close" size={20} iconName={() => "close"} onClick={onClose} />
                    <CloseEventListIcon />
                </div>
            </div>
            <div id="code" class="code"></div>
        </>
    )
}

function EventPreview() {
    const [event,] = eventPreview.solid.useOne("event")
    const showCodePreview = () => !event();
    return (
        <>
            <div id="event-preview">
                <div class="content">
                    <FullStatePreview />
                </div>
                <div classList={{ "content": true, "hidden": showCodePreview() }}>
                    <MonacoEditorPreview />
                </div>
            </div>
            <EventList />
        </>
    )
}

export default EventPreview