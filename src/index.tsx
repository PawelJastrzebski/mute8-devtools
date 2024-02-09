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

// Eeager Init
clientController
monacoEditor

// vite hot reload
if (import.meta.hot) {
    import.meta.hot.on('vite:afterUpdate', () => {
        setTimeout(() => monacoEditor.init(), 0);
        setTimeout(() => monacoEditorDiff.init(), 0);
    });
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
