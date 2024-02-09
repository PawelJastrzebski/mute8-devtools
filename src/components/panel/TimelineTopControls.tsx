import { newStore } from "mute8-solid";
import { Mute8Storage, storageController } from "../../services/StorageController";
import Icon from "../Icon"
import "./TimelineTopControls.scss"
const iconSize = 26;

export const topControls = newStore({
    value: {
        selected: false,
        cursor: 0,
        total: 0,
        disableNext: true,
        disablePrevious: true
    },
    actions: {
        updateStatus(store: Mute8Storage | null) {
            this.selected = !!store
            this.disableNext = !(store?.hasNext() ?? false)
            this.disablePrevious = !(store?.hasPrevious() ?? false)
            this.cursor = (store?.getCursor() ?? -1) + 1
            this.total = store?.total() ?? 0
        }
    }
})

type Props = {
    children?: any,
    disabled?: () => boolean
    onClick?: () => void
};
function ControlsButton(props: Props) {
    return (
        <div onClick={props.onClick} classList={{ "controls-button": true, "disabled": props.disabled?.() }}>
            {props.children}
        </div>
    )
}

function TimelineTopControls() {
    const [disableNext,] = topControls.solid.useOne("disableNext")
    const [disablePrevious,] = topControls.solid.useOne("disablePrevious")
    return (
        <div id="timeline-top-controlls">
            <ControlsButton onClick={() => storageController.previousEvent()} disabled={disablePrevious} >
                <Icon iconName='keybord-tab' flipX={true} size={iconSize} />
            </ControlsButton>
            <ControlsButton onClick={() => { }}>
                <Icon iconName='paly-circle' size={iconSize} />
            </ControlsButton>
            <ControlsButton onClick={() => storageController.nextEvent()} disabled={disableNext} >
                <Icon iconName='keybord-tab' size={iconSize} />
            </ControlsButton>
        </div>
    )
}

export default TimelineTopControls