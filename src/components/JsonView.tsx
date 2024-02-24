import type { ComponentProps } from "solid-js"
// web-component
import '@alenaksu/json-viewer/json-viewer.js';
import "./JsonView.scss"
import { onMount } from "solid-js";
declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            "json-viewer": ComponentProps<"div"> & { data?: object }
        }
    }
}

const style = document.createElement('style')
style.innerHTML = `
ul { margin: 0 }
.key.collapsable:before { color: #b3b3b3 }
`

export function JsonView(props: { id: string, data: () => object }) {
    let ref: any;
    onMount(() => {
        ref.shadowRoot.appendChild(style)
    })

    return <json-viewer ref={ref} id={props.id} data={props.data()}></json-viewer>
}

interface JsonViewer {
    expand(regex: string): void
    expandAll(): void
    collapse(regex: string): void
    collapseAll(): void
    search(regex: string): void
}

export const getJsonViewer = (id: string) => (document.getElementById(id) as any) as JsonViewer | undefined

export const expandJsonViewer = (id: string) => {
    getJsonViewer(id)?.expandAll()
}

export const collapseJsonViewer = (id: string) => {
    getJsonViewer(id)?.collapseAll()
}