import { useState } from "react"
import styles from "./Gallery.module.scss"

function Gallery(elements, autoplay = false) {

    const [items, setItems] = useState(elements)

    return (
        <div className={styles.slider}>
            {items.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
            ))}
        </div>
    )
}

export default Gallery
