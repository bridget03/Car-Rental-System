import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./TestimonialSlider.module.css";
import { Testimonial } from "@/utils/types/Car";


const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        "Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste perspiciatis ut rspiciatis.",
      author: "Jason Hall",
      location: "Edison, NJ",
      image: "/testimonials/p-1.jpg", 
    },
    {
      id: 2,
      quote:
        "Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste perspiciatis ut rspiciatis.",
      author: "Emily Gonzalez",
      location: "Cranston, RI",
      image: "/testimonials/p-2.jpg",
    },
    {
      id: 3,
      quote:
        "Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste perspiciatis ut rspiciatis.",
      author: "Samuel Donovan",
      location: "Joplin, MO",
      image: "/testimonials/p-3.jpg",
    },
    {
      id: 4,
      quote:
        "Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste perspiciatis ut rspiciatis.",
      author: "Samuel Quanna",
      location: "Joplin, MO",
      image: "/testimonials/p-4.jpg",
    },
  ];
  

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  //     }, 5000);

  //     return () => clearInterval(timer);
  //   }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const getVisibleSlides = () => {
    const slides = [];
    for (let i = 0; i < 3; i++) {
      const slideIndex = (currentSlide + i) % testimonials.length;
      slides.push({ ...testimonials[slideIndex], position: i });
    }
    return slides;
  };
  const [animating, setAnimating] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        What <span className={styles.highlight}>Clients</span> Say
      </h2>
      <p className={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit vitae porta.
      </p>

      <div className={styles.sliderContainer}>
        <div
          className={`${styles.slider} ${animating ? styles.animating : ""}`}
        >
          {getVisibleSlides().map((testimonial) => (
            <div
              key={testimonial.id}
              className={`${styles.slide} ${
                testimonial.position === 1 ? styles.centerSlide : ""
              }`}
            >
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.quote}>{testimonial.quote}</p>
              <div className={styles.author}>
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  className={styles.authorImage}
                  width={60}
                  height={60}
                />
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{testimonial.author}</h4>
                  <p className={styles.authorLocation}>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentSlide ? styles.activeDot : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
