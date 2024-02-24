import { newStore } from "mute8-solid"
import { JsonView, collapseJsonViewer, expandJsonViewer } from "../JsonView"
import "./FullStatePreview.scss"
import Icon from "../Icon";
import { toJsonPritty } from "../../services/MonacoEditor";
import { router } from "../../services/Router";
import { createMemo } from "solid-js";

export const storeFullPreview = newStore({
    value: {
        events: 0,
        stores: 0,
        storeJson: {} as Record<string, object>
    },
    actions: {
        reset(storeRegisterd: number = 0) {
            this.stores = storeRegisterd;
            this.events = 0;
            this.storeJson = {}
        },
        updateStoreState(label: string, state: object, incrementEvents = true) {
            this.storeJson[label] = state;
            if (incrementEvents) {
                this.events = this.events + 1;
            }
        },
        incrementEventsCount(value: number = 1) {
            this.events = this.events + value
        },
        setStoreRegisterd(value: number) {
            this.stores = value;
        }
    }
})

const moveToClickBoard = () => {
    const json = toJsonPritty(storeFullPreview.storeJson)
    navigator.clipboard.writeText(json);
}

export function FullStatePreview() {
    const [isConnected,] = router.solid.useOne("isConnected")
    const storeJson = storeFullPreview.solid.useOne("storeJson")[0]
    const eventsCount = storeFullPreview.solid.useOne("events")[0]
    const storesCount = storeFullPreview.solid.useOne("stores")[0]
    const id = "full-state-JsonView"
    const onCollapse = () => { collapseJsonViewer(id) }
    const onExpand = () => { expandJsonViewer(id) }
    const onCopy = () => { moveToClickBoard() }

    const codeNode = createMemo(() => {
        if(isConnected()) {
            return  <JsonView id={id} data={storeJson} />
        }

        return <div class="devtools-disconnect-info">Disconnected from application</div>
    })

    return (
        <div id="full-state-preview">
            <div classList={{"top": true, "connected": isConnected()}}>
                <div class="left-icons">
                    <div class="type-info wrapper">Full State</div>
                    <Icon data-tooltip="Collapse All" size={20} iconName={() => "collapse"} onClick={onCollapse} />
                    <Icon data-tooltip="Expand All" size={20} iconName={() => "expand"} onClick={onExpand} />
                    <Icon data-tooltip="Copy" size={20} iconName={() => "copy"} onClick={onCopy} />
                </div>
                <div class="right-stats">
                    <div data-tooltip-left="Stores" class="type-info wrapper">Stores: {storesCount()}</div>
                    <div data-tooltip-left="Total events" class="type-info wrapper">Events: {eventsCount()}</div>
                </div>
            </div>
            <div class="code json-view">
                {codeNode()}
            </div>
        </div>
    )
}