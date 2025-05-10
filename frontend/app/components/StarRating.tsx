"use client"
import { StarIcon } from '@heroicons/react/24/solid';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  // numReviews: number;  // Commented out for future implementation
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  // numReviews,  // Commented out for future implementation
  size = 'medium' 
}) => {
  return (
    <div className={`${styles.starRating} ${styles[size]}`}>
      <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
      <div className={styles.stars}>
        {[...Array(5)].map((_, index) => {
          const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
          return (
            <span 
              key={index} 
              className={styles.star}
            >
              <span className={styles.starBackground}>★</span>
              <span 
                className={styles.starFill}
                style={{
                  width: `${fillPercentage}%`
                }}
              >
                ★
              </span>
            </span>
          );
        })}
      </div>
      {/* Commented out for future implementation
      <span className={styles.reviewCount}>({numReviews})</span>
      */}
    </div>
  );
};