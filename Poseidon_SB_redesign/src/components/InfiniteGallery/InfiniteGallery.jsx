import React, { useRef, useEffect, useState } from "react"
import styles from "./InfiniteGallery.module.scss"

const InfiniteGallery = ({ items, navigateCards, setNavigateCards, autoplay = false, autoplayInterval = 3000 }) => {
    const galleryRef = useRef(null)
    const [cards, setCards] = useState(items)
    const [offset, setOffset] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [currentImage, setCurrentImage] = useState(1)

    const animationFrameRef = useRef(null)

    const addItems = () => {
        if (isLoading) return
        setIsLoading(true)
        setCards((prevItems) => [...prevItems, ...items])
        setIsLoading(false)
    }

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setStartX(e.clientX - galleryRef.current.offsetLeft)
        setScrollLeft(galleryRef.current.scrollLeft)
        galleryRef.current.style.cursor = "move" // Cursore che non interferisce con l'hover
    }

    const handleMouseLeave = () => {
        handleMouseUp()
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }

        // Solo applica lo snap finale se lo desideri
        smoothScrollToNearestPosition()
    }

    const handleMouseMove = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isDragging) return

        const x = e.clientX - galleryRef.current.offsetLeft
        const walk = x - startX // La distanza percorsa

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }

        // Esegui lo scroll in tempo reale durante il movimento
        animationFrameRef.current = requestAnimationFrame(() => {
            galleryRef.current.scrollLeft = scrollLeft - walk
        })
    }

    const smoothScrollToNearestPosition = () => {
        const gallery = galleryRef.current
        const scrollDifference = gallery.scrollLeft - scrollLeft

        // Se la distanza percorsa è inferiore a 24px, ripristina la posizione iniziale
        if (Math.abs(scrollDifference) < 16) {
            gallery.scrollTo({
                left: scrollLeft, // Torna alla posizione iniziale
                behavior: "smooth", // Scroll fluido
            })
            return
        }

        const cardWidth = gallery.querySelector("div").offsetWidth

        // Calcola la nuova posizione di scroll, in base alla direzione
        let newScrollPosition = scrollLeft // Inizia dalla posizione iniziale

        if (scrollDifference > 0) {
            // Se la distanza percorsa è positiva (scroll verso destra), avanza di un elemento
            newScrollPosition += cardWidth
        } else {
            // Se la distanza percorsa è negativa (scroll verso sinistra), torna indietro di un elemento
            newScrollPosition -= cardWidth
        }

        // Esegui lo scroll fluido
        gallery.scrollTo({
            left: newScrollPosition,
            behavior: "smooth", // Effettua lo scroll in modo fluido
        })

        // Aggiorna la posizione iniziale per il prossimo movimento
        setScrollLeft(newScrollPosition) // Imposta la nuova posizione come punto di partenza per il prossimo movimento
    }

    // Funzione per scrollare di un offset specifico
    const scrollByOffset = (direction) => {
        const gallery = galleryRef.current
        const cardWidth = gallery.querySelector("div").offsetWidth
        const currentOffset = cardWidth
        setOffset(() => cardWidth)

        let offsetValue = 0

        if (direction === "back") {
            offsetValue = -currentOffset
        } else if (direction === "forward") {
            offsetValue = currentOffset
        }

        if (offsetValue !== 0) {
            const newScrollPosition = gallery.scrollLeft + offsetValue

            // Esegui il movimento dello scroll con comportamento 'smooth'
            gallery.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            })

            // La durata dell'animazione di scroll (in millisecondi), puoi regolarla se necessario
            const scrollDuration = 500 // Durata dell'animazione in ms (ad esempio, 500ms)

            // Usa setTimeout per chiamare setNavigateCards dopo che lo scroll è finito
            setTimeout(() => {
                if (setNavigateCards) {
                    setNavigateCards(false) // Imposta navigateCards su false dopo il termine dello scroll
                }
            }, scrollDuration) // Imposta il ritardo pari alla durata dell'animazione
        }
    }

    useEffect(() => {
        const gallery = galleryRef.current
        const cardWidth = gallery.querySelector("div").offsetWidth
        setOffset(() => cardWidth)

        const handleScroll = () => {
            if (gallery.scrollLeft + gallery.offsetWidth >= gallery.scrollWidth - 10) {
                addItems()
            }

            if (gallery.scrollLeft <= 10) {
                addItems()
            }
        }

        gallery.addEventListener("scroll", handleScroll)
        return () => {
            gallery.removeEventListener("scroll", handleScroll)
        }
    }, [cards])

    useEffect(() => {
        if (!autoplay) return

        console.log("autoplaying")

        const autoplayId = setInterval(() => {
            scrollByOffset("forward") // Si sposta in avanti, ma fa lo "snapping" alla posizione più vicina
        }, autoplayInterval)

        return () => clearInterval(autoplayId) // Cleanup per evitare esecuzioni multiple in Strict Mode o quando il componente si smonta
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const gallery = galleryRef.current
            const cardWidth = gallery.querySelector("div").offsetWidth
            setOffset(cardWidth)

            if (!gallery) return

            // Resetta la posizione di scroll all'inizio (0) quando la finestra viene ridimensionata
            gallery.scrollLeft = 0

            // Calcola la posizione più vicina per uno scroll animato, se desiderato
            const nearestPosition = Math.round(gallery.scrollLeft / offset) * offset

            // Scroll dolce alla posizione più vicina
            smoothScrollToNearestPosition(nearestPosition)
        }

        // Aggiungi listener per il resize
        window.addEventListener("resize", handleResize)

        // Cleanup: rimuovi l'event listener al momento del dismount
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, []) // Solo al primo montaggio

    // Effetto per triggerare lo scroll quando il parametro `navigateCards` cambia
    useEffect(() => {
        if (navigateCards === "back" || navigateCards === "forward") {
            scrollByOffset(navigateCards)
        }
    }, [navigateCards])

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={galleryRef}
            className={styles.infiniteGallery}
        >
            <div className={styles.currentImage}>
                <div className={`${styles.circle} ${currentImage === 1 && styles.circleSeleced}`}></div>
                <div className={`${styles.circle} ${currentImage === 2 && styles.circleSeleced}`}></div>
                <div className={`${styles.circle} ${currentImage === 3 && styles.circleSeleced}`}></div>

            </div>

            {cards.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
            ))}
        </div>
    )
}

export default InfiniteGallery
