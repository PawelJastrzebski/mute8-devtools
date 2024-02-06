import "./TopBar.scss"

// todo env file;
export const githubUrl = "https://github.com/PawelJastrzebski/mute8"
export const homePageUrl = "https://paweljastrzebski.github.io/mute8/"

export function Logo() {
    return (
        <a target="_blank" href={homePageUrl}>
            <div id="small-logo"></div>
        </a>
    )
}

export function GitHubLink() {
    return (
        <a target="_blank" href={githubUrl}>
            <div class="header-github-link"></div>
        </a>
    )
}

function TopBar(props: { children?: any }) {
    return (
        <div id="top-bar">
            <Logo />
            {props.children}
            <GitHubLink />
        </div>
    )
}

export default TopBar