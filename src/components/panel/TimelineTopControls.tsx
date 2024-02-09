import { storageController, topControls } from "../../services/StorageController";
import Icon from "../Icon"
import "./TimelineTopControls.scss"
const iconSize = 26;


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