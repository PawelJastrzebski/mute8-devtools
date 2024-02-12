import { newStore } from "mute8-solid"
import LogoBaner from "../LogoBanner"
import "./Dashboard.scss"
import Icon from "../Icon";
import { createSignal } from "solid-js";
import { getSelectedMute8StoreCache } from "../../services/StorageController";

export const dashboardStore = newStore({
    value: {
        storeRegisterd: 0,
        events: 0
    },
    actions: {
        reset(storeRegisterd: number = 0) {
            this.storeRegisterd = storeRegisterd;
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

const [hidden, setHidden] = createSignal(true)
const iconSize = 50;

function Dashboard() {
    const [store,] = dashboardStore.solid.use()
    setTimeout(() => setHidden(false), !!getSelectedMute8StoreCache() ? 1200 : 200);

    return (
        <div classList={{ "hidden": hidden() }} id="dashboard">
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