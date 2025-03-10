import styles from "./styles.module.css";
import Layout from "@layout/Layout";

import { FaScroll } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Image from "next/image";

export default function Index() {
  const teamMembers = [
    {
      name: "VanTTH13",
      role: "Scrum Master",
      image: "/vantth.png",
    },
    {
      name: "KhanhHT4",
      role: "Lead Dev",
      image: "/khanhht.jpg",
    },
    {
      name: "ChinhND20",
      role: "Dev",
      image: "/chinhnd.png",
    },

    {
      name: "LamNT103",
      role: "Dev",
      image: "/lamnt.png",
    },
    {
      name: "QuanNA25",
      role: "Dev",
      image: "/quannd.png",
    },
  ];
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.hero}>
        <h1 className={styles.heading}>About Us</h1>
        <p>
          Providing the best car rental service for your trips! <br />
          <span style={{ fontStyle: "italic", marginTop: "1rem" }}>
            Sponsored by #Moc2
          </span>
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.heading}>Who We Are</h2>
        <p className={styles.des}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quas,
          ut, minima recusandae omnis dignissimos, doloribus iusto eius sapiente
          ratione vitae ducimus. Tempore quasi ipsam in, dolore minus laboriosam
          unde?
        </p>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.teamBox}>
              <div className={styles.imageWrapper}>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <div className={styles.socialIcons}>
                <FaFacebookF className={styles.icon} />
                <FaTwitter className={styles.icon} />
                <FaLinkedinIn className={styles.icon} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Why Choose Us?</h2>
        <ul className={styles.list}>
          <li>
            <FaCheckCircle
              style={{
                color: "green",
                fontSize: "24px",
                marginRight: "0.5rem",
              }}
            />
            <p>A wide range of vehicles</p>
          </li>
          <li>
            <FaCheckCircle
              style={{
                color: "green",
                fontSize: "24px",
                marginRight: "0.5rem",
              }}
            />{" "}
            <p>Affordable prices</p>
          </li>
          <li>
            <FaCheckCircle
              style={{
                color: "green",
                fontSize: "24px",
                marginRight: "0.5rem",
              }}
            />{" "}
            <p>24/7 customer support</p>
          </li>
          <li>
            <FaCheckCircle
              style={{
                color: "green",
                fontSize: "24px",
                marginRight: "0.5rem",
              }}
            />{" "}
            <p>Easy booking process</p>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Terms and Conditions</h2>
        <p className={styles.des}>
          Please read our terms and conditions carefully before renting a
          vehicle. By using our services, you agree to comply with our policies.
        </p>
        <div className={styles.termsBox}>
          <h3>
            <FaScroll className={styles.termIcon} /> Rental Requirements
          </h3>
          <p>Minimum age: 21 years. Valid driving license required.</p>

          <h3>
            <FaScroll className={styles.termIcon} /> Payment and Cancellation
          </h3>
          <p>
            Payment can be made via credit card or cash. Free cancellation
            within 24 hours.
          </p>

          <h3>
            <FaScroll className={styles.termIcon} /> Customer Responsibilities
          </h3>
          <p>
            Customers must take care of the vehicle and report any damage
            immediately.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Contact Us</h2>
        <p className={styles.des}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quas,
          ut, minima recusandae omnis dignissimos, doloribus iusto eius sapiente
          ratione vitae ducimus. Tempore quasi ipsam in, dolore minus laboriosam
          unde?
        </p>
        <div className={styles.contact}>
          <div className={styles.contactBox}>
            <div>
              <FaLocationArrow className={styles.contactIcon} />
            </div>
            <p className={styles.contactLabel}>Address</p>
            <p className={styles.contactInfo}>FVille 1 - Hoa Lac Town</p>
          </div>
          <div className={styles.contactBox}>
            <div>
              <FaPhoneAlt className={styles.contactIcon} />
            </div>
            <p className={styles.contactLabel}>Phone</p>
            <p className={styles.contactInfo}>0123 456 789</p>
          </div>
          <div className={styles.contactBox}>
            <div>
              <FaEnvelope className={styles.contactIcon} />
            </div>
            <p className={styles.contactLabel}>Email</p>
            <p className={styles.contactInfo}>support@carrental.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
