import "./EventPreview.scss"
import { createMemo } from "solid-js"
import { eventPreview } from "../../services/StorageController"

const toJsonPritty = (state: object) => JSON.stringify(state, null, 2);

function EventPreview() {
    const [event,] = eventPreview.solid.useOne("event")

    return (
        <div id="event-preview">
            <div class="top"></div>
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