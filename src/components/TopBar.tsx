import { githubUrl, homePageUrl } from ".."
import "./TopBar.scss"
import { router } from "../services/Router"

export function Logo() {
    return (
        <a target="_blank" href={homePageUrl}>
            <div id="small-logo"></div>
        </a>
    )
}

function TopBar(props: { children?: any }) {
    const displayVersion = router.solid.select(v => v.topBarVersion)
    return (
        <div
            id="top-bar"
            class={`${displayVersion()}`}
        >
            <div class="left-side">
                <Logo />
                <a href={homePageUrl} target="_blank" class="nav-label">Docs</a>
                <a href={githubUrl} target="_blank" class="nav-label">GitHub</a>
            </div>
            {props.children}
        </div>
    )
}

export default TopBar