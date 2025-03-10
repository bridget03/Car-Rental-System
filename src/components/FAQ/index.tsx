import { FAQ } from "./FAQ";

const FAQPage = () => {
  const faqItems = [
    {
      question: "Do I need a credit card?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      question: "Can I cross border with my rental car?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Can I rent specific car model?",
      answer:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "What is included in the rental charges?",
      answer:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "Which documents are needed to pick up a rental car?",
      answer:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  return (
    <div style={{ background: "var(--background)", minHeight: "fit-content", paddingBottom:"2rem" }}>
      <FAQ items={faqItems} />
    </div>
  );
};

export default FAQPage;
