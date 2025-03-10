import Image from "next/image";
import styles from "./styles.module.css";

const locations = [
  { name: "Hanoi", image: "/locations/ha-noi.webp", cars: "50+ cars" },
  { name: "Ho Chi Minh City", image: "/locations/ho-chi-minh-city.jpg", cars: "100+ cars" },
  { name: "Da Nang - Hoi An", image: "/locations/hoi-an.jpg", cars: "50+ cars" },
  { name: "Nha Trang", image: "/locations/nha-trang.jpeg", cars: "50+ cars" },
  { name: "Da Lat", image: "/locations/da-lat.jpeg", cars: "50+ cars" },
  { name: "Quang Ninh", image: "/locations/quang-ninh.png", cars: "50+ cars" },
];


export default function Location() {
  return (
    <section id="location" className={styles.location}>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          <span>Where</span> to find us?
        </h1>
        <div className={styles.grid}>
          {locations.map((location, index) => (
            <div key={index} className={styles.column}>
              <div className={styles.box}>
                <div className={styles.box_bg}>
                  <Image
                    fill
                    src={location.image}
                    alt={location.name}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.box_body}>
                  <div className={styles.box_title}>{location.name}</div>
                  <div className={styles.box_content}>{location.cars}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
