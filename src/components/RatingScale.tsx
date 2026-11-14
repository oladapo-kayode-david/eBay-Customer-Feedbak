import React from 'react';
import {QuestionId} from '../data/questions';

interface RatingScaleProps {
  questionId: QuestionId;
  min: 0 | 1;
  max: 5 | 10;
  value: number | null;
  minLabel: string;
  maxLabel: string;
  showStars?: boolean;
  hasError?: boolean;
  errorId?: string;
  onChange: (value: number) => void;
  onBlur: () => void;
}

export const RatingScale: React.FC<RatingScaleProps> = ({
  questionId,
  min,
  max,
  value,
  minLabel,
  maxLabel,
  showStars = false,
  hasError = false,
  errorId,
  onChange,
  onBlur,
}) => {
  const values = Array.from({length: max - min + 1}, (_, index) => min + index);
  const groupClass = max === 5 ? 'rating-buttons-5' : 'rating-buttons-11';

  const handleGroupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      onBlur();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % values.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + values.length) % values.length;
    }
    if (nextIndex !== null) {
      const nextScore = values[nextIndex];
      onChange(nextScore);
      const groupEl = e.currentTarget.parentElement;
      const buttons = groupEl?.querySelectorAll<HTMLButtonElement>('button');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      className="rating-group"
      role="radiogroup"
      aria-invalid={hasError ? 'true' : undefined}
      aria-describedby={hasError && errorId ? errorId : undefined}
      onBlur={handleGroupBlur}
    >
      <div className={groupClass}>
        {values.map((score, idx) => {
          const isSelected = value === score;
          return (
            <button
              key={score}
              id={idx === 0 ? `${questionId}-control` : undefined}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={
                max === 5 ? `${score} out of 5` : `${score} out of 10`
              }
              className={`rating-btn${isSelected ? ' is-selected' : ''}`}
              onClick={() => onChange(score)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {showStars && (
                <svg
                  className="rating-star"
                  viewBox="0 0 24 24"
                  fill={isSelected ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
              <span>{score}</span>
            </button>
          );
        })}
      </div>
      <div className="rating-anchors">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};
