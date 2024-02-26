import { createMemo, createSignal } from "solid-js"
import "./SideBar.scss"
import { Mute8Storage, storageController } from "../../services/StorageController"
import Icon from "../Icon"
import { newStore } from "mute8-solid"
import Button from "../Button"
import { overrideController } from "../../services/OverrideController"
import { router } from "../../services/Router"

const setFilterPhraseCache = (phrase: string) => localStorage.setItem("-phrase-cache-", phrase);
const getFilterPhraseCache = () => localStorage.getItem("-phrase-cache-") ?? "";

interface StorageListItem {
    label: string
    overrided: boolean,
}
export const storageList = newStore({
    value: {
        filterPhrase: getFilterPhraseCache(),
        list: [] as StorageListItem[]
    },
    actions: {
        updateAll(storagesRegistry: Map<string, Mute8Storage>) {
            this.list = Array.from(storagesRegistry.values()).map(storage => {
                return {
                    label: storage.label,
                    overrided: storage.overrided
                }
            })
        },
        filter(phrase: string) {
            setFilterPhraseCache(phrase)
            this.filterPhrase = phrase;
        }
    }
})

// @ts-ignore
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
    const store = storageController.getMute8ViewStore(props.label);
    const [events,] = store.solid.useOne("events")
    const [selected,] = store.solid.useOne("selected")
    const centerButton = store.solid.select(s => s.overrided ? "paly-circle" : "pause")
    return (
        <div classList={{ "storage-instance": true, "selected": selected() }}>
            <div class="top">
                <div onclick={() => props.onSelect(props.label)} class="nav-label"> {props.label}</div>
                {/* <SwitchButton color="#7700aa" /> */}
                <Button class="gray-button" onClick={() => overrideController.setOverride(props.label)} disabled={() => false} >
                    <Icon iconName={centerButton} size={20} />
                </Button>
            </div>
            <div class="stats">
                <span>Events</span> {events()}
            </div>
        </div>
    )
}

function SideBar() {
    const [isConnected,] = router.solid.useOne("isConnected")
    const [list,] = storageList.solid.use()
    const [filterPhrase,] = storageList.solid.useOne("filterPhrase")
    const components = createMemo(() => {
        const store = list()
        return store.list
            .filter((storage: any) => storage.label.toLocaleLowerCase().startsWith(store.filterPhrase))
            .map((storage: any) => {
                return (
                    <StorageListItem
                        onSelect={(l) => storageController.selectStore(l)}
                        label={storage.label}
                        showOntimeline={storage.showOnTimeline}
                    />)
            })
    })
    return (
        <div classList={{"visible": isConnected()}} id="side-bar">
            <div class="filter top-bar-style">
                <Icon iconName={() => 'search'} size={22} />
                <input
                    value={filterPhrase()}
                    onkeyup={(e) => storageController.filterList((e.target as any).value)}
                    placeholder="Filter"
                ></input>
            </div>
            <div class="items">
                {components()}
            </div>
        </div>
    )
}

export default SideBar