import { router } from "../services/Router"
import "./Footer.scss"

function Footer() {
    const displayVersion = router.solid.select(v => v.footerVersion)
    return (
        <div
            id="footer"
            class={`${displayVersion()}`}
        >
            <span>© 2024 Mute8.</span>
        </div>
    )
}

export default Footer