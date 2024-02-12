import { newStore } from "mute8-solid"
import LogoBaner from "../LogoBanner"
import "./Dashboard.scss"
import Icon from "../Icon";

export const dashboardStore = newStore({
    value: {
        storeRegisterd: 0,
        events: 0
    },
    actions: {
        reset() {
            this.storeRegisterd = 0;
            this.events = 0;
        },
        incrementEventsCount(value: number = 1) {
            this.events = this.events + value
        },
        setStoreRegisterd(value: number) {
            this.storeRegisterd = value;
        }
    }
})

const iconSize = 50;
function Dashboard() {
    const [store,] = dashboardStore.solid.use()

    return (
        <div id="dashboard">
            <div class="dashboard-content">
                <div class="row">
                    <LogoBaner small={true} />
                </div>
                <div class="row">
                    <div class="card">
                        <div class="row">
                            <Icon size={iconSize} iconName={() => "monitoring"} />
                            <b data-tooltip="Total events">{store().events}</b>
                        </div>
                        <span>Total events</span>
                    </div>
                    <div class="card">
                        <div class="row">
                            <Icon size={iconSize} iconName={() => "database"} />
                            <b>{store().storeRegisterd}</b>
                        </div>
                        <span>Store registry</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard