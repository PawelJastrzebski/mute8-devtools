/* @refresh reload */
import { render } from 'solid-js/web'
import { useView } from "./services/Router"
import './index.scss'
import { createMemo } from 'solid-js'
import { clientController } from './services/ClientConnector'
import Panel from './pages/Panel'
import Home from './pages/Home'
import { monacoEditor } from './services/MonacoEditor'
import { monacoEditorDiff } from './services/MonacoEditor'
import { storageController } from './services/StorageController'

// Eeager Init
storageController
clientController
monacoEditor

// vite hot reload
if (import.meta.hot) {
    import.meta.hot.on('vite:afterUpdate', () => setTimeout(() => {
        monacoEditor.init()
        monacoEditorDiff.init()
        storageController.select()
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
