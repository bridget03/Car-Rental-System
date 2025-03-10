import { ProcessStep } from "@/utils/types/Car";
import { useEffect, useRef, useState } from "react";
import { FaCar, FaShieldAlt, FaWallet } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdAttachMoney, MdWarning } from "react-icons/md";
import styles from "./styles.module.css";

const RentalProcess = () => {
  const leftContentRef = useRef<HTMLDivElement>(null);
  const leftWrapperRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!leftContentRef.current || !leftWrapperRef.current) return;

      const headerHeight = 92;
      const container = leftWrapperRef.current;
      const content = leftContentRef.current;

      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const containerTop = containerRect.top;
      const contentHeight = contentRect.height;
      const maxTranslate = containerRect.height - contentHeight;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerTop <= headerHeight) {
            const proposedTranslate = Math.abs(containerTop - headerHeight);
            setTranslateY(Math.min(proposedTranslate, maxTranslate));
          } else {
            setTranslateY(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps: ProcessStep[] = [
    {
      icon: <MdAttachMoney />,
      title: "How the insurance works",
      description:
        "From the minute you hand the keys over till the second you get them back you are covered. Your private insurance is not affected",
    },
    {
      icon: <FaShieldAlt />,
      title: "It's completely free",
      description:
        "We offer both owners and renters free sign ups. It's only once a vehicle is rented out that a share is deducted to cover admin and insurance.",
    },
    {
      icon: <FaRegCircleCheck />,
      title: "You decide the price",
      description:
        "When you list a car you decide the price. We can help with recommendations as to price, but ultimately you decide!",
    },
    {
      icon: <FaCar />,
      title: "Handling over your vehicle",
      description:
        "You arrange the time and location for the exchange of your vehicle with the renter. Both parties will need to agree and sign the vehicle rental sheet before and after key handover.",
    },
    {
      icon: <MdWarning />,
      title: "You are in charge",
      description:
        "All renters are pre-screened by us to ensure safety and get your approval. If you do not feel comfortable with someone you are able to decline a booking.",
    },
    {
      icon: <FaWallet />,
      title: "Set payment",
      description:
        "We pay you once a month and you can always view how much your car has earned under your user profile.",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {/* Left section */}
          <div className={styles.leftSectionWrapper} ref={leftWrapperRef}>
            <div
              ref={leftContentRef}
              className={styles.leftContent}
              style={{ transform: `translateY(${translateY}px)` }}
            >
              <h1 className={styles.title}>
                Have a car
                <span className={styles.highlight}> for rent?</span>
              </h1>
              <p className={styles.description}>Don't miss out your benefit</p>
            </div>
          </div>

          {/* Right section */}
          <div className={styles.rightSection}>
            <div className={styles.timelineLine} />

            {steps.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{step.icon}</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalProcess;
