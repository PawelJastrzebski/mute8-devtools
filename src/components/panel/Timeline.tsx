import { createSignal } from "solid-js"
import "./Timeline.scss"

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
    if (isActive && (x < -200 || x  > width + 200 || fromBottom > 300)) {
        setActive(false)
    }
    console.log("x")
})

window.addEventListener('mouseup', () => setActive(false))

function Timeline() {

    return (
        <div id="timeline">
            <div
                onMouseDown={() => !active() && (setActive(true) && console.log("1"))}
                onMouseUp={() => active() && setActive(false)}
                style={`left: ${x()}px`}
                class={`pointer ${(active() ? "active": "")}`}
            >
            </div>
        </div>
    )
}

export default Timeline