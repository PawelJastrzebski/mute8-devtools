import "./EventPreview.scss"
import { createMemo } from "solid-js"
import { eventPreview } from "../../services/StorageController"

const toJsonPritty = (state: object) => JSON.stringify(state, null, 2);

function EventPreview() {
    const [event,] = eventPreview.solid.useOne("event")

    const code = createMemo(() => {
        const e = event();
        if (!e) return <></>

        if (e.type == 'change-state') {
            return <>{toJsonPritty(e.newState)}</>
        } else {
            return <>{toJsonPritty(e.state)}</>
        }
    })

    return (
        <div id="event-preview">
            <div class="top"></div>
            <div class="code">
                <pre>
                    {code()}
                </pre>
            </div>
        </div>
    )

}

export default EventPreview