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

function StorageListItem(props: { label: string, showOntimeline: boolean, onSelect: (label: string) => void }) {
    const store = storageController.getStore(props.label);
    const [events,] = store.solid.useOne("events")
    const [selected,] = store.solid.useOne("selected")
    return (
        <div classList={{ "storage-instance": true, "selected": selected() }}>
            <div class="top">
                <div onclick={() => props.onSelect(props.label)} class="label"> {props.label}</div>
                <SwitchButton color="#7700aa" />
            </div>
            <div class="stats">
                <span>Events</span> {events()}
            </div>
        </div>
    )
}

function SideBar() {
    const [list,] = storageList.solid.use()
    const components = createMemo(() => {
        const store = list()
        return store.list
            .filter(storage => storage.label.toLocaleLowerCase().startsWith(store.filterPhrase))
            .map(storage => {
                return (
                    <StorageListItem
                        onSelect={(l) => storageController.select(l)}
                        label={storage.label}
                        showOntimeline={storage.showOnTimeline}
                    />)
            })
    })
    return (
        <div id="side-bar">
            <div class="filter">
                <Icon iconName='search' size={24} />
                <input
                    onkeyup={(e) => storageController.filter((e.target as any).value)}
                    placeholder="Search Store"
                ></input>
            </div>
            <div class="items">
                {components()}
            </div>
        </div>
    )
}

export default SideBar