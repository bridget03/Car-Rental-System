import styles from './Tab.module.css';

interface TabProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ children, active, onClick }) => {
  return (
    <button
      className={`${styles.tab} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};