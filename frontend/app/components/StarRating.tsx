"use client"
import { StarIcon } from '@heroicons/react/24/solid';
import styles from './StarRating.module.css';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  onRatingSubmit?: (rating: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 'medium',
  onRatingSubmit,
  readonly = true
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (selectedRating: number) => {
    if (!readonly && onRatingSubmit) {
      onRatingSubmit(selectedRating);
    }
  };

  return (
    <div className={`${styles.starRating} ${styles[size]}`}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            className={`${styles.star} ${!readonly ? styles.interactive : ''}`}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            onClick={() => handleClick(star)}
          >
            <span className={styles.starBackground}>★</span>
            <span 
              className={styles.starFill}
              style={{
                width: `${Math.min(Math.max(((hoverRating || rating) - star + 1) * 100, 0), 100)}%`
              }}
            >
              ★
            </span>
          </span>
        ))}
      </div>
      <span className={styles.ratingNumber}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};