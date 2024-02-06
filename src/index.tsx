/* @refresh reload */
import { render } from 'solid-js/web'
import { useView } from "./services/Router"
import './index.scss'
import { createMemo } from 'solid-js'
import TopBar from './components/TopBar'
import { clientController } from './services/ClientConnector'
import Footer from './components/Footer'
import LogoBanner from './components/LogoBanner'

// Eeager Init
clientController

function Panel() {
    return (
        <>
            <TopBar />
            <h1>Panel</h1>
        </>
    )
}

function Home() {
    return (
        <>
            <TopBar />
            <LogoBanner />
            <div class="body">
            <h1>Home</h1>

            </div>
            <Footer />
        </>
    )
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
