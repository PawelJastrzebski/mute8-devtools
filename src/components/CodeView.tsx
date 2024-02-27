
import Prism from 'prismjs';
import "./CodeView.scss"
import { onMount } from 'solid-js';

const formatCode = (code: string) => {
    let result = code;
    for (let index = 0; index < 10; index++) {
        result = result.replace(" }", "}")
    }
    return result;
}

export function CodeView(props: { code: string, id: string }) {
    let node: HTMLElement = null as any
    const html = Prism.highlight(formatCode(props.code), Prism.languages.javascript, 'javascript');
    onMount(() => node.innerHTML = html)

    return <pre ref={node as any} id={props.id}>
        {props.code}
    </pre>
}