import { createMemo } from "solid-js"
import { githubUrl } from ".."

type IconsNames = "refresh" | "git" | "start" | "keybord-tab" | "pause" | "paly-circle" | "search" | "close" | "database" | "monitoring" | "copy" | "expand" | "collapse" | "list"

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
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="white" d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" /></svg>
        )
    }
    if (name == 'paly-circle') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path fill="white" d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" /></svg>
        )
    }

    if (name == 'search') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path fill="#fff" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
        )
    }
    if (name == 'close') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path fill="#fff" d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
        )
    }
    if (name == 'database') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960"><path  fill="#fff" d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z"/></svg>
        )
    }    
    if (name == 'monitoring') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size}  viewBox="0 -960 960 960"><path fill="#fff" d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        )
    }   

    if (name == 'copy') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"  height={size} width={size} viewBox="0 -960 960 960" ><path fill="#fff" d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
        )
    }  

    if (name == 'expand') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="#fff" d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z"/></svg>
        )
    }
    if (name == 'collapse') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} fill="#fff" viewBox="0 -960 960 960" ><path d="m356-160-56-56 180-180 180 180-56 56-124-124-124 124Zm124-404L300-744l56-56 124 124 124-124 56 56-180 180Z"/></svg>
        )
    }
    if (name == 'list') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size} viewBox="0 -960 960 960" ><path fill="#fff" d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/></svg>
        )
    }
    return <></>
}

type Props = {
    iconName: () => IconsNames,
    size?: number,
    flipX?: boolean,
    "data-tooltip"?: string
    "data-tooltip-left"?: string
    onClick?: () => void
};
export default function Icon(props: Props) {
    const icon = createMemo(() => {
        return getSvgIcon(props.iconName(), props.size ?? 24)
    })
    return (
        <div
            data-tooltip={props["data-tooltip"]}
            data-tooltip-left={props["data-tooltip-left"]}
            onClick={props.onClick}
            class={`icon ${props.iconName()}-icon 
        ${(props.flipX ?? false) ? "flip-x" : ""}`
            }>
            {icon()}
        </div>
    )
}

export function GitHubLink() {
    return (
        <a target="_blank" href={githubUrl}>
            <Icon iconName={() => "git"} />
        </a>
    )
}