import "./Button.scss"

type Props = {
    class?: string,
    children?: any,
    disabled?: () => boolean
    onClick?: () => void
};
function Button(props: Props) {
    return (
        <div onClick={props.onClick} classList={{ "mute8-button": true, [props.class ?? ""]: true, "disabled": props.disabled?.() }}>
            {props.children}
        </div>
    )
}

export default Button