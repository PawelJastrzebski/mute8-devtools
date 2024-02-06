import "./TopBar.scss"

// todo env file;
export const homePageUrl = "https://paweljastrzebski.github.io/mute8/"

export function Logo() {
    return (
        <a target="_blank" href={homePageUrl}>
            <div id="small-logo"></div>
        </a>
    )
}


function TopBar(props: { children?: any }) {
    return (
        <div id="top-bar">
            <Logo />
            {props.children}
        </div>
    )
}

export default TopBar