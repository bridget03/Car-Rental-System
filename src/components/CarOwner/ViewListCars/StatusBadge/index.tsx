import styles from './StatusBadge.module.css';

export const StatusBadge = ({ status }) => {
    const statusClass = styles[status.toLowerCase()];
    
    return (
      <span className={`${styles.badge} ${statusClass}`}>
        {status}
      </span>
    );
  };