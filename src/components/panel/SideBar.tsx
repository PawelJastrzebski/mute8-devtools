import { createSignal } from "solid-js"
import "./SideBar.scss"

function SwitchButton(props: { color: string }) {
    const [isActive, setActive] = createSignal(true)

    return (
        <div
            onClick={() => setActive(!isActive())}
            classList={{ "switch-off": !isActive() }}
            class="switch"
            style={`background-color: ${props.color}`}
        >
            <div></div>
        </div>
    )
}

function Instance() {
    return (
        <div class="storage-instance">
            <div class="label"> cars-storage</div>
            <SwitchButton color="#7700aa" />
        </div>
    )
}


function SideBar() {
    return (
        <div id="side-bar">
            <Instance />
            <Instance />
            <Instance />
        </div>
    )
}

export default SideBar