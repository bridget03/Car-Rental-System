import { useState, useEffect } from "react";
import styles from "./CarImageSlider.module.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface CarImageSliderProps {
    images: string[];
    addMode?: boolean;
}

export const CarImageSlider: React.FC<CarImageSliderProps> = ({ images, addMode = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<"next" | "prev" | "">("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToPrevious = () => {
        if (isTransitioning) return;
        setSlideDirection("prev");
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        if (isTransitioning) return;
        setSlideDirection("next");
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToImage = (index: number) => {
        if (isTransitioning) return;
        setSlideDirection(index > currentIndex ? "next" : "prev");
        setIsTransitioning(true);
        setCurrentIndex(index);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
            setSlideDirection("");
        }, 400);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    useEffect(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, [images]);

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                {/* <div className={styles.slideTrack}> */}
                <img
                    src={images[currentIndex]}
                    alt={`Car view ${currentIndex + 1}`}
                    className={`${styles.image} ${styles[slideDirection]}`}
                    onTransitionEnd={() => setIsTransitioning(false)}
                />
                {/* </div> */}

                <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={goToPrevious}
                    disabled={isTransitioning}
                >
                    <IoIosArrowBack size={24} />
                </button>

                <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={goToNext}
                    disabled={isTransitioning}
                >
                    <IoIosArrowForward size={24} />
                </button>
            </div>

            <div className={styles.indicators}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.indicator} ${index === currentIndex ? styles.active : ""}`}
                        onClick={() => goToImage(index)}
                        disabled={isTransitioning}
                    />
                ))}
            </div>
        </div>
    );
};
