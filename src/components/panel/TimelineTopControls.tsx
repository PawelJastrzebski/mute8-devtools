import "./TimelineTopControls.scss"
import { newStore } from "mute8-solid";
import { Mute8Storage, storageController } from "../../services/StorageController";
import Icon from "../Icon"
import Button from "../Button";
const iconSize = 26;

type OverrideState = "disabled" | "pause" | "play";
export const topControls = newStore({
    value: {
        ovverrideMode: "disabled" as OverrideState,
        selected: false,
        cursor: 0,
        total: 0,
        disableNext: true,
        disablePrevious: true
    },
    actions: {
        updateStatus(store: Mute8Storage | null) {
            this.selected = !!store
            this.total = store?.total() ?? 0
            this.disableNext = !(store?.hasNext() ?? false)
            this.disablePrevious = !(store?.hasPrevious() ?? false)

            if (store) {
                this.cursor = store.getCursor() + 1;
                this.ovverrideMode = store.ovverrideMode ? "play" : "pause"
            } else {
                this.cursor = 0;
                this.ovverrideMode = "disabled"
            }
        }
    }
})

function TimelineTopControls() {
    const [disableNext,] = topControls.solid.useOne("disableNext")
    const [disablePrevious,] = topControls.solid.useOne("disablePrevious")
    const [ovverrideMode,] = topControls.solid.useOne("ovverrideMode")
    const centerIconName = () => ovverrideMode() === 'play' ? 'paly-circle' : "pause"
    return (
        <div id="timeline-top-controlls">
            <Button onClick={() => storageController.previousEvent()} disabled={disablePrevious} >
                <Icon iconName={() => 'keybord-tab'} flipX={true} size={iconSize} />
            </Button>
            <Button onClick={() => storageController.toogleOverrideMode()} disabled={() => ovverrideMode() == "disabled"} >
                <Icon iconName={centerIconName} size={iconSize} />
            </Button>
            <Button onClick={() => storageController.nextEvent()} disabled={disableNext} >
                <Icon iconName={() => 'keybord-tab'} size={iconSize} />
            </Button>
        </div>
    )
}

export default TimelineTopControls