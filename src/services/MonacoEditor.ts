import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

const createDiv = (id: string, root: HTMLElement) => {
    const div = document.createElement("div")
    div.id = id
    root.appendChild(div)
    return div
}

export const toJsonPritty = (state: object) => JSON.stringify(state, null, 2);

class MonacoEditor {
    monacoEditorNode: HTMLElement | null = null;
    monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
    constructor(
        private id: string
    ) {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    init() {
        const root = document.getElementById('code') as HTMLElement;
        if (this.monacoEditorNode) {
            this.monacoEditorNode.remove()
        }

        this.monacoEditorNode = createDiv(this.id, root)
        this.monacoEditor = monaco.editor.create(this.monacoEditorNode!, {
            value: "",
            language: 'json',
            theme: "vs-dark",
            scrollBeyondLastLine: true,
            readOnly: true,
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        })
    }
    setCode(code: string) {
        if(this.monacoEditor) {
            this.monacoEditor?.setValue(code)
            this.monacoEditor?.setScrollPosition({scrollTop: 0});
        }
    }

}

export const monacoEditor = new MonacoEditor("monaco-editor")