import { FAQItem } from './FAQItem';
import styles from './FAQ.module.css';

interface FAQProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQ: React.FC<FAQProps> = ({ items }) => {
  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.title}>
        Frequently Asked <span className={styles.highlight}>Questions</span>
      </h2>
      <div className={styles.faqList}>
        {items.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
};
