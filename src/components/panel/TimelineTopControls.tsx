import Icon from "../Icon"
import "./TimelineTopControls.scss"
const iconSize = 26;


function ControlsButton(props: { children?: any }) {
    return (
        <div class="controls-button">
            {props.children}
        </div>
    )
}

function TimelineTopControls() {
    return (
        <div id="timeline-top-controlls">
            <ControlsButton>
                <Icon onClick={() => { }} iconName='keybord-tab' flipX={true} size={iconSize} />
            </ControlsButton>
            <ControlsButton>
                <Icon onClick={() => { }} iconName='paly-circle' size={iconSize} />
            </ControlsButton>
            <ControlsButton>
                <Icon onClick={() => { }} iconName='keybord-tab' size={iconSize} />
            </ControlsButton>
        </div>
    )
}

export default TimelineTopControls