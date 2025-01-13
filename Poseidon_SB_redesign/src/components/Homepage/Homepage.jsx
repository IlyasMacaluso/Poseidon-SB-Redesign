import styles from "./Homepage.module.scss"
import seaImage from "../../assets/images/See you soon-rafiki.svg"
import image1 from "../../assets/images/1.png"
import image2 from "../../assets/images/2.png"
import image3 from "../../assets/images/3.png"
import ImageGallery from "react-image-gallery"
import { useState } from "react"
import { useEffect } from "react"

function Homepage() {
    const [word, setWord] = useState("")
    const [mounted, setMounted] = useState(false)
    const parole = ["tecnologia", "consulenza", "territorio", "benefits"]

    //ciclo ogni parola all'interno dell'array

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    async function cycleWords(words) {
        if (!words) return;
    
        while (true) {
            for (const word of words) {
                // Aggiunge la parola lettera per lettera
                for (let i = 0; i < word.length; i++) {
                    await delay(350);
                    setWord((prev) => prev + word[i]);
                }
    
                // Rimuove la parola lettera per lettera
                for (let i = 0; i < word.length; i++) {
                    await delay(350);
                    setWord((prev) => prev.slice(0, -1));
                }
            }
        }
    }

    useEffect(() => {
        setMounted((prev) => {
            if (prev) return
            cycleWords(parole)
            return true
        })
        return
    }, [])

    return (
        <div className={styles.homepage}>
            <section className={styles.aboveTheFold}>
                <div className={styles.items}>
                    <div className={styles.topItems}>
                        <img src={seaImage} alt="" />
                    </div>
                    <div className={styles.bottomItems}>
                        <h2>Mastering the sea of coding</h2>
                    </div>
                </div>
            </section>

            <section className={styles.chiSiamo}>
                <div className={styles.items}>
                    <div className={styles.leftItems}>
                        <h3>CHI SIAMO</h3>
                        <p>
                            Poseidon SB è una società di <strong>consulenza di processo e IT</strong> , specializzata nella delivery di
                            progetti con team altamente qualificati su tecnologie moderne, prevalentemente nell’ambito dell’automazione, del
                            Digital Procurement e dell’HR.
                        </p>

                        <p>
                            Pur essendo una società ancora giovane, ha maturato nei suoi primi due anni di vita una significativa esperienza
                            su <strong>30+ aziende italiane e internazionali</strong> di medie e grandi dimensioni e conta su un{" "}
                            <strong>team di oltre 40 persone.</strong>
                        </p>
                    </div>

                    <div className={styles.rightItems}>
                        <ImageGallery
                            infinite={true}
                            showThumbnails={false}
                            showBullets={true}
                            showFullscreenButton={false}
                            showNav={false}
                            showPlayButton={false}
                            autoPlay={true}
                            items={[
                                {
                                    original: image1,
                                    thumbnail: image1,
                                },
                                {
                                    original: image2,
                                    thumbnail: image2,
                                },
                                {
                                    original: image3,
                                    thumbnail: image3,
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className={styles.chiSiamo}>
                <div>
                    <p>{word}</p>
                </div>
            </section>
        </div>
    )
}

export default Homepage
