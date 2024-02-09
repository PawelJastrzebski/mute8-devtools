import "./EventPreview.scss"
import { createMemo } from "solid-js"
import { eventPreview, topControls } from "../../services/StorageController"
import timestamp from "time-stamp"

function EventPreview() {
    const [event,] = eventPreview.solid.useOne("event")
    const [cursor,] = topControls.solid.useOne("cursor")
    const [total,] = topControls.solid.useOne("total")

    const eventInfo = createMemo(() => {
        const e = event()
        if(!e) return <></>

        const t = timestamp("HH:mm:ss:ms", new Date(e.time))
        return (
            <>
                <div data-tooltip="Event Type" class="type-info wrapper">{e.type}</div>
                <div data-tooltip="Selected/Total" class="stats">{cursor()}/{total()}</div>
                <div data-tooltip-left="Event Timestamp"  class="timestamp wrapper">{t}</div>
            </>
        )
    })

    return (
        <div id="event-preview">
            <div class="top">
                {eventInfo()}
            </div>
            <div id="code" class="code">
                {/* <div id="monaco-editor" class="monaco-editor"></div> */}

                {/* <pre>
                    {code()}
                </pre> */}
            </div>
        </div>
    )

}

export default EventPreview