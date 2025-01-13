import logo from "../../assets/images/poseidonsb_logo_rgb@2x-1-300x87.png"
import styles from "./Navigation.module.scss"
function Navigation() {
    return (
        <div className={styles.navigation}>
            <div className={styles.items}>
                <div className={styles.leftItems}>
                    <img src={logo} />
                </div>
                <div className={styles.rightItems}>
                    <ul className={styles.navLinks}>
                        <li className={styles.link}>Chi Siamo</li>
                        <li className={styles.link}>Tecnologie</li>
                        <li className={styles.link}>Consulenza</li>
                        <li className={styles.link}>Territorio</li>
                        <li className={styles.link}>Società e Benefit</li>
                        <li className={styles.link}>Lavora con noi</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navigation
