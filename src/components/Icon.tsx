type IconsNames = "refresh" | "git" | "start" | "keybord-tab" | "pause" | "paly-circle";

function getSvgIcon(name: IconsNames, size: number = 24) {
    if (name == 'refresh') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path fill="#FFFFFF" d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>
        )
    }

    if (name == 'git') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 0 24 24"><path fill="white" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
        )
    }

    if (name == 'start') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="white" d="M80-240v-480h80v480H80Zm560 0-57-56 144-144H240v-80h487L584-664l56-56 240 240-240 240Z" /></svg>
        )
    }
    if (name == 'keybord-tab') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="white" d="M800-240v-480h80v480h-80Zm-320 0-57-56 144-144H80v-80h487L424-664l56-56 240 240-240 240Z" /></svg>
        )
    }    
    
    if (name == 'pause') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="white"  d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>
        )
    }
    if (name == 'paly-circle') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path fill="white" d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
        )
    }
    return <></>
}

export default function Icon(props: { iconName: IconsNames, size?: number,  flipX?: boolean, onClick?: () => void }) {
    const icon = getSvgIcon(props.iconName, props.size ?? 24)
    return (
        <div onClick={props.onClick} class={`icon ${props.iconName}-icon ${(props.flipX ?? false) ? "flip-x" : ""}`}>
            {icon}
        </div>
    )
}

export const githubUrl = "https://github.com/PawelJastrzebski/mute8"

export function GitHubLink() {
    return (
        <a target="_blank" href={githubUrl}>
            <Icon iconName="git" />
        </a>
    )
}