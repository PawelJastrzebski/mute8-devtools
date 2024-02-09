import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { StoreEvent } from './StorageController'

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

const createMonacoDiv = (id: string, root: HTMLElement) => {
    const div = document.createElement("div")
    div.id = id
    div.classList.add("monaco-editor")
    div.classList.add("monaco-hidden")
    root.appendChild(div)
    return div
}

const hiddenClass = "monaco-hidden";
const hideDiv = (node: HTMLElement | null, isHidden: boolean) => {
    if (!node) return
    if (node.classList.contains(hiddenClass) && !isHidden) {
        node.classList.remove(hiddenClass)
    } else if (!node.classList.contains(hiddenClass) && isHidden) {
        node.classList.add(hiddenClass)
    }
}

const commonOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: "",
    language: 'json',
    theme: "vs-dark",
    scrollBeyondLastLine: true,
    readOnly: true,
    automaticLayout: true,
    minimap: {
        enabled: false
    }
}

export const toJsonPritty = (state: object) => JSON.stringify(state, null, 2);

class MonacoEditor {
    monacoEditorNode: HTMLElement | null = null;
    monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
    constructor(
        private rootId: string,
        private id: string
    ) {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    init() {
        const root = document.getElementById(this.rootId) as HTMLElement;
        this.monacoEditorNode?.remove()
        this.monacoEditorNode = createMonacoDiv(this.id, root)
        this.monacoEditor = monaco.editor.create(this.monacoEditorNode!, {
            ...commonOptions
        })
    }
    setCode(code: string) {
        if (!this.monacoEditor) return;
        this.monacoEditor.setValue(code)
        this.monacoEditor.setScrollPosition({ scrollTop: 0 });

    }
    setHidden(hide: boolean) {
        hideDiv(this.monacoEditorNode, hide)
    }
}


class MonacoEditorDiff {
    monacoDiffNode: HTMLElement | null = null;
    monacoDiff: monaco.editor.IStandaloneDiffEditor | null = null;
    constructor(
        private rootId: string,
        private id: string
    ) {
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    init() {
        const root = document.getElementById(this.rootId) as HTMLElement;
        this.monacoDiffNode?.remove()
        this.monacoDiffNode = createMonacoDiv(this.id, root)
        this.monacoDiff = monaco.editor.createDiffEditor(this.monacoDiffNode!, {
            ...commonOptions,
            originalEditable: false
        }
        );
    }
    setCode(oldCode: string, newCode: string) {
        if (!this.monacoDiff) return;
        const originalModel = monaco.editor.createModel(oldCode, "json");
        const modifiedModel = monaco.editor.createModel(newCode, "json");
        this.monacoDiff.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    }
    setHidden(hide: boolean) {
        hideDiv(this.monacoDiffNode, hide)
    }
}

export const monacoEditor = new MonacoEditor("code", "monaco-editor-standard")
export const monacoEditorDiff = new MonacoEditorDiff("code", "monaco-editor-diff")

export const displayEvent = (event: StoreEvent | null) => {
    if (event == null) {
        monacoEditor.setHidden(true)
        monacoEditorDiff.setHidden(true)
    } else if (event.type === 'init-state') {
        monacoEditorDiff.setHidden(true)
        monacoEditor.setHidden(false)
        monacoEditor.setCode(toJsonPritty(event.state))
    } else if (event.type === 'change-state') {
        monacoEditor.setHidden(true)
        monacoEditorDiff.setHidden(false)
        monacoEditorDiff.setCode(toJsonPritty(event.oldState), toJsonPritty(event.newState))
    }
}