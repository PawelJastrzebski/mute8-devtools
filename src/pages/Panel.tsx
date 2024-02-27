import Icon from '../components/Icon'
import TopBar from '../components/TopBar'
import EventPreview from '../components/panel/EventPreview'
import SideBar from '../components/panel/SideBar'
import Timeline from '../components/panel/Timeline'
import { refreshHostApp } from '../services/ClientConnector'

export default function Panel() {
    return (
        <>
            <TopBar>
                <div style="display: flex">
                    <Icon
                        data-tooltip-left="Refresh Application (R)"
                        onClick={refreshHostApp}
                        iconName={() => 'refresh'}
                        size={24}
                    />
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