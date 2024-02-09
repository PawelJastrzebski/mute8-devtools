import Icon, { GitHubLink } from '../components/Icon'
import TopBar from '../components/TopBar'
import EventPreview from '../components/panel/EventPreview'
import SideBar from '../components/panel/SideBar'
import Timeline from '../components/panel/Timeline'
import TimelineTopControls from '../components/panel/TimelineTopControls'
import { clientController } from '../services/ClientConnector'

export default function Panel() {
    return (
        <>
            <TopBar>
                <TimelineTopControls />
                <div style="display: flex">
                    <Icon onClick={() => clientController.sendCommand("refresh-host")} iconName='refresh' size={32} />
                    <GitHubLink />
                </div>
            </TopBar>
            <div class="body">
                <SideBar />
                <EventPreview />
            </div>
            <Timeline />
        </>
    )
}