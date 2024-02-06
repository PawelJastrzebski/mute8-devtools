import Icon, { GitHubLink } from '../components/Icon'
import TopBar from '../components/TopBar'
import SideBar from '../components/panel/SideBar'
import TimelineTopControls from '../components/panel/TimelineTopControls'

export default function Panel() {
    return (
        <>
            <TopBar>
                <TimelineTopControls />
                <div style="display: flex">
                    <Icon onClick={() => window.location.reload()} iconName='refresh' size={32} />
                    <GitHubLink />
                </div>
            </TopBar>
            <div class="body">

                <SideBar />

            </div>
        </>
    )
}