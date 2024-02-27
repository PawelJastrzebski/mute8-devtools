import "./Button.scss"

type Props = {
    class?: string,
    children?: any,
    disabled?: () => boolean
    onClick?: () => void

    "data-tooltip"?: string
    "data-tooltip-left"?: string
    "data-tooltip-left-flat"?: string
};
function Button(props: Props) {
    return (
        <div
            onClick={props.onClick}
            classList={{ "mute8-button": true, [props.class ?? ""]: true, "disabled": props.disabled?.() }}

            data-tooltip={props["data-tooltip"]}
            data-tooltip-left={props["data-tooltip-left"]}
            data-tooltip-left-flat={props["data-tooltip-left-flat"]}
        >
            {props.children}
        </div>
    )
}

export default Button