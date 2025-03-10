import { useState } from "react";
import styles from "./FAQ.module.css";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItemContainer}>
      <button
        className={`${styles.faqItem} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.question}>{question}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowActive : ""}`}>
          ›
        </span>
      </button>
      {isOpen && (
        <div className={styles.answerContainer}>
          <div className={styles.answer}>{answer}</div>
        </div>
      )}
    </div>
  );
};
