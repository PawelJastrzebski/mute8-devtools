import Icon, { GitHubLink } from '../components/Icon'
import TopBar from '../components/TopBar'
import SideBar from '../components/panel/SideBar'

export default function Panel() {
    return (
        <>
            <TopBar>
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