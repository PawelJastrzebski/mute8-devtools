/* @refresh reload */
import { render } from 'solid-js/web'
import { useView } from "./services/Router"
import './index.scss'
import { createMemo } from 'solid-js'
import { hostConnector } from './services/ClientConnector'
import Panel from './pages/Panel'
import Home from './pages/Home'
import { monacoEditor } from './services/MonacoEditor'
import { monacoEditorDiff } from './services/MonacoEditor'
import { storageController } from './services/StorageController'
import { keyboard } from './services/Keyboard'
import { timelineRender } from './services/TimelineRender'

// Eeager Init
storageController
hostConnector
monacoEditor
keyboard

// vite hot reload
if (import.meta.hot) {
    import.meta.hot.on('vite:afterUpdate', () => setTimeout(() => {
        monacoEditor.init()
        monacoEditorDiff.init()
        storageController.selectStore()
        timelineRender.init()
        keyboard.init()
    }, 0)
    );
}

function Router() {
    const [view,] = useView()
    const currentView = createMemo(() => {
        const current = view()
        if (current == 'panel') {
            return <Panel />
        }
        return <Home />
    })

    return (<>{currentView()}</>)
}

function App() {
    return (<>
        <Router />
    </>)
}

render(() => <App />, document.getElementById('root')!)
