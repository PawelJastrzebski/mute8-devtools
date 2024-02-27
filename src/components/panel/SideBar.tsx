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

// filter
let storageListFull = [] as StorageListItem[];
const filter = (phrase: string) => storageListFull.filter((storage: any) => storage.label.toLocaleLowerCase().startsWith(phrase))

export const storageList = newStore({
    value: {
        filterPhrase: getFilterPhraseCache(),
        list: [] as StorageListItem[]
    },
    actions: {
        updateAll(storagesRegistry: Map<string, Mute8Storage>) {
            storageListFull = Array.from(storagesRegistry.values()).map(storage => {
                return {
                    label: storage.label,
                    overrided: storage.overrided
                }
            })
            this.list = filter(this.filterPhrase)
        },
        filter(phrase: string) {
            setFilterPhraseCache(phrase)
            this.filterPhrase = phrase
            this.list = filter(phrase)
        }
    }
})

const filterId = "sidebar-storage-filter"
export const storeListFilterisFocused = () => document.activeElement?.id === filterId
export const focusStoreListFilter = () => {
    if (storeListFilterisFocused()) return false;
    const node = document.getElementById(filterId)
    node?.focus()
    return true
}

export const toggleSelectedStoreByListIndex = (index: number) => {
    const store = storageList.list[index]
    if (!store) return;
    const isSelected = storageController.selected?.label === store.label;
    storageController.selectStore(isSelected ? null : store.label)
}

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

function StorageListItem(props: {
    label: string,
    showOntimeline: boolean,
    onSelect: (label: string) => void
    tabindex?: number
}) {
    const store = storageController.getMute8ViewStore(props.label);
    const [events,] = store.solid.useOne("events")
    const [selected,] = store.solid.useOne("selected")
    const centerButton = store.solid.select(s => s.overrided ? "paly-circle" : "pause")
    const centerButtonTooltip = store.solid.select(s => !s.overrided ? "Override" : "Resume")
    const tollgeOverrideMode = () => overrideController.setOverride(props.label);
    return (
        <div tabindex={props.tabindex} classList={{ "storage-instance": true, "selected": selected() }}>
            <div class="top">
                <div onclick={() => props.onSelect(props.label)} class="nav-label"> {props.label}</div>
                {/* <SwitchButton color="#7700aa" /> */}
                <Button data-tooltip-left-flat={centerButtonTooltip()} class="gray-button" onClick={tollgeOverrideMode} disabled={() => false} >
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
        return list().list.map((storage: any, index) => {
            return (
                <StorageListItem
                    tabindex={index + 1}
                    onSelect={(l) => storageController.selectStore(l)}
                    label={storage.label}
                    showOntimeline={storage.showOnTimeline}
                />
            )
        })
    })
    return (
        <div classList={{ "visible": isConnected() }} id="side-bar">
            <div class="filter top-bar-style">
                <Icon iconName={() => 'search'} size={20} opacity={.6} />
                <input
                    id={filterId}
                    tabindex={0}
                    value={filterPhrase()}
                    onkeyup={(e) => storageList.actions.filter((e.target as any).value)}
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