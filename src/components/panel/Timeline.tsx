import { createSignal } from "solid-js"
import "./Timeline.scss"
import { newStore } from "mute8-solid"
import { timelineRender } from "../../services/TimelineRender"

const timelineStore = newStore({
    value: {
        hidden: true,
        showUI: false
    },
    actions: {
        showUI(showUI: boolean) {
            this.showUI = showUI
            setTimeout(() => this.showUI ? timelineRender.mount() : timelineRender.unmount(), 0)
            if (this.showUI == false) {
                this.hidden = true
            }
        },
        show() {
            this.hidden = false;
        }
    }
})

export const toggleTimelineUI = () => { timelineStore.actions.showUI(!timelineStore.showUI) }
export const showTimeline = () => { timelineStore.actions.show() }


// Pointer controll
const [x, setX] = createSignal(100)
const [active, setActive] = createSignal(false)
window.addEventListener("mousemove", (event: MouseEvent) => {
    const isActive = active();
    const width = window.innerWidth;
    const fromBottom = window.innerHeight - event.clientY;
    const x = event.pageX;
    if (isActive && x > 0 && x < width) {
        setX(x)
    }
    if (isActive && (x < -200 || x > width + 200 || fromBottom > 300)) {
        setActive(false)
    }
})
window.addEventListener('mouseup', () => setActive(false))

function Timeline() {
    const [hidden,] = timelineStore.solid.useOne("hidden")
    const showUI = timelineStore.solid.select(v => v.showUI)

    return (
        <div classList={{ "showUI": showUI() }} id="timeline">
            <div
                onMouseDown={() => !active() && (setActive(true))}
                onMouseUp={() => active() && setActive(false)}
                style={`left: ${x()}px`}
                class={`pointer ${(active() ? "active" : "")}`}
            >
            </div>
            <div classList={{ "hidden": hidden() }} id="timeline-canvas-wrapper"></div>
        </div>
    )
}

export default Timeline