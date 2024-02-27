import "./TimelineTopControls.scss"
import { newStore } from "mute8-solid";
import { Mute8Storage, storageController } from "../../services/StorageController";
import Icon from "../Icon"
import Button from "../Button";
const iconSize = 20;

type OverrideState = "disabled" | "pause" | "play";
export const topControls = newStore({
    value: {
        ovverrideMode: "disabled" as OverrideState,
        selectedLable: null as string | null,
        cursor: 0,
        total: 0,
        disableNext: true,
        disablePrevious: true
    },
    actions: {
        updateStatus(store: Mute8Storage | null) {
            this.selectedLable = store?.label ?? null;
            this.total = store?.total() ?? 0
            this.disableNext = !(store?.has(+1) ?? false)
            this.disablePrevious = !(store?.has(-1) ?? false)

            if (store) {
                this.cursor = store.getCursor() + 1;
                this.ovverrideMode = store.overrided ? "play" : "pause"
            } else {
                this.cursor = 0;
                this.ovverrideMode = "disabled"
            }
        }
    }
})

function TimelineTopControls() {
    const hidden = topControls.solid.select(v => !v.selectedLable)
    const disableNext = topControls.solid.useOne("disableNext")[0]
    const disablePrevious = topControls.solid.useOne("disablePrevious")[0]
    const ovverrideMode = topControls.solid.select(v => v.ovverrideMode)
    const centerIconName = () => ovverrideMode() === "play" ? "paly-circle" : "pause"

    const back = () => storageController.previousEvent();
    const paly = () => storageController.toggleOverride();
    const next = () => storageController.nextEvent()
    const last = () => storageController.lastEvent()

    return (
        <div classList={{ "hidden": hidden() }} id="timeline-top-controlls">
            <Button data-tooltip="Previous Event (A)" onClick={back} disabled={disablePrevious} >
                <Icon iconName={() => 'keybord-tab'} flipX={true} size={iconSize} />
            </Button>
            <Button  data-tooltip={ovverrideMode() == "pause" ? "Override" : "Resume"} onClick={paly} disabled={() => ovverrideMode() == "disabled"} >
                <Icon iconName={centerIconName} size={iconSize} />
            </Button>
            <Button data-tooltip="Next Event (D)" onClick={next} disabled={disableNext} >
                <Icon iconName={() => 'keybord-tab'} size={iconSize} />
            </Button>
            <Button data-tooltip="Last Event (Alt + D)" onClick={last} disabled={() => false} >
                <Icon iconName={() => 'last-page'} size={iconSize} />
            </Button>
        </div>
    )
}

export default TimelineTopControls