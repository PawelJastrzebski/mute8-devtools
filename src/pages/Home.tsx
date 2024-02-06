import TopBar from '../components/TopBar'

import Footer from '../components/Footer'
import LogoBanner from '../components/LogoBanner'
import { GitHubLink } from '../components/Icon'

export default function Home() {
    return (
        <>
            <TopBar>
                <GitHubLink />
            </TopBar>
            <LogoBanner />
            <div class="body">
                <h1>Home</h1>

            </div>
            <Footer />
        </>
    )
}