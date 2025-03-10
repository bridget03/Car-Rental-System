import Image from "next/image";
import styles from "./styles.module.css";
import bgi from "@assets/bgi2.jpg";

import imgp1 from "@assets/testimonials/p-1.jpg";
import imgp2 from "@assets/testimonials/p-2.jpg";
import imgp3 from "@assets/testimonials/p-3.jpg";
import imgp4 from "@assets/testimonials/p-4.jpg";

// Testimonial Data
const testimonials = [
  {
    img: imgp1,
    name: "Sarah",
    content: "The user prefers eco-friendly vehicles for their car rentals.",
  },
  {
    img: imgp2,
    name: "Peter",
    content:
      "The user frequently rents cars for business trips and prefers premium models.",
  },
  {
    img: imgp3,
    name: "Ellen",
    content:
      "The user has a history of renting cars for family vacations and values spacious interiors.",
  },
  {
    img: imgp4,
    name: "Anton",
    content:
      "The user often books last-minute rentals and values the availability of 24/7 customer support.",
  },
];

export default function Testimonial() {
  return (
    <div className={styles.mainContainer}>
      <section
        id="testimonial"
        className={styles.testimonial}
        style={{
          backgroundImage: `url(${bgi.src})`,
          borderRadius: "35px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.container}>
          <h1 className={styles.heading}>
            <span>What</span> people say?
          </h1>
          <div className={styles.row}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={styles.column}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className={styles.box}>
                  <div className={styles.boxImage}>
                    <Image src={testimonial.img} alt={testimonial.name} />
                  </div>
                  <div className={styles.boxBody}>
                    <div className={styles.boxTitle}>{testimonial.name}</div>
                    <div className={styles.boxContent}>
                      "{testimonial.content}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
