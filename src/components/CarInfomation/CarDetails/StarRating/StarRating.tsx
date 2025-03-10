import styles from "./styles.module.css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  return (
    <div className={styles.ratings}>
      <div className={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={styles.star}>
            ★
          </span>
        ))}
        <div
          className={styles.starBackground}
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={styles.star}>
              ★
            </span>
          ))}
        </div>
      </div>
      <span className={styles.ratingText}>{rating.toFixed(1)}/5</span>
      {!rating && <span className={styles.noRating}>(No ratings yet)</span>}
    </div>
  );
};
