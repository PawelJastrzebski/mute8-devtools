import { createMemo, createSignal } from "solid-js"
import "./SideBar.scss"
import { storageController, storageList } from "../../services/StorageController"
import Icon from "../Icon"

function SwitchButton(props: { color: string }) {
    const [isActive, setActive] = createSignal(false)

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

function StorageListItem(props: { label: string, showOntimeline: boolean }) {
    const [events,] = storageController.getStatsStore(props.label).solid.useOne("events")

    return (
        <div class="storage-instance">
            <div class="top">
                <div class="label"> {props.label}</div>
                <SwitchButton color="#7700aa" />
            </div>
            <div class="stats">
                <span>Events</span> {events()}
            </div>
        </div>
    )
}

function SideBar() {
    const [list,] = storageList.solid.useOne("list")
    const [filter,] = storageList.solid.useOne("filterPhrase")
    const components = createMemo(() => {
        const phrase = filter().toLocaleLowerCase();
        return list()
            .filter(storage => storage.label.toLocaleLowerCase().startsWith(phrase))
            .map(storage => {
                return (<StorageListItem label={storage.label} showOntimeline={storage.showOnTimeline} />)
            })
    })
    return (
        <div id="side-bar">
            <div class="filter">
                <Icon iconName='search' size={24} />
                <input onKeyDown={(e) => storageController.filter((e.target as any).value)} placeholder="Search"></input>
            </div>
            <div class="items">
                {components()}
            </div>
        </div>
    )
}

export default SideBar