"use client"
import styles from './StarRating.module.css';
import { useState, useEffect } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  onRatingSubmit?: (rating: number) => Promise<void>;
  readonly?: boolean;
  className?: string;
  numReviews?: number;
}

// Custom sharp star SVG component
const SharpStar: React.FC<{ filled: boolean; percentage?: number }> = ({ filled, percentage = 100 }) => (
  <div className={styles.starContainer}>
    {/* Background star */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`${styles.starBackground} h-5 w-5`}
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
    
    {/* Filled star with clip path */}
    {percentage > 0 && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${styles.starFill} h-5 w-5`}
        style={{
          clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`
        }}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    )}
  </div>
);

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'medium',
  onRatingSubmit,
  readonly = true,
  className = '',
  numReviews
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(rating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = async (selectedRating: number) => {
    if (readonly || !onRatingSubmit || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setCurrentRating(selectedRating);
      await onRatingSubmit(selectedRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      setCurrentRating(rating); // Reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.starRating} ${styles[size]} ${className}`}>
      <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => {
          const displayRating = hoverRating || currentRating;
          const fillPercentage = Math.min(Math.max((displayRating - star + 1) * 100, 0), 100);
          
          return (
            <button
              key={star}
              type="button"
              disabled={readonly || isSubmitting}
              className={`${styles.star} ${!readonly ? styles.interactive : ''}`}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(null)}
              onClick={() => handleClick(star)}
            >
              <span className="text-[#FFD700]">
                <SharpStar filled={fillPercentage > 0} percentage={fillPercentage} />
              </span>
            </button>
          );
        })}
      </div>
      {numReviews !== undefined && (
        <span className={styles.reviewCount}>
          ({numReviews} Ratings)
        </span>
      )}
    </div>
  );
};