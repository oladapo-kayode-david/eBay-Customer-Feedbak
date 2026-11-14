import React from 'react';
import {NONE_OPTION, QuestionId} from '../data/questions';

interface CheckboxGroupProps {
  questionId: QuestionId;
  options: string[];
  selectedValues: string[];
  hasError?: boolean;
  errorId?: string;
  onChange: (nextValues: string[]) => void;
  onBlur: () => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  questionId,
  options,
  selectedValues,
  hasError = false,
  errorId,
  onChange,
  onBlur,
}) => {
  const isNoneSelected = selectedValues.includes(NONE_OPTION);

  const handleToggle = (option: string) => {
    if (option === NONE_OPTION) {
      if (isNoneSelected) {
        onChange([]);
      } else {
        onChange([NONE_OPTION]);
      }
      return;
    }

    const withoutNone = selectedValues.filter((item) => item !== NONE_OPTION);
    if (withoutNone.includes(option)) {
      onChange(withoutNone.filter((item) => item !== option));
    } else {
      onChange([...withoutNone, option]);
    }
  };

  const handleGroupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      onBlur();
    }
  };

  return (
    <div
      className="choice-grid"
      aria-describedby={hasError && errorId ? errorId : undefined}
      onBlur={handleGroupBlur}
    >
      {options.map((option, idx) => {
        const isChecked = selectedValues.includes(option);
        const isDisabled = option !== NONE_OPTION && isNoneSelected;
        const inputId = `${questionId}-option-${idx}`;

        return (
          <label
            key={option}
            htmlFor={inputId}
            className={`choice-item${isChecked ? ' is-checked' : ''}${
              isDisabled ? ' is-disabled' : ''
            }`}
          >
            <input
              id={inputId}
              type="checkbox"
              name={questionId}
              value={option}
              checked={isChecked}
              disabled={isDisabled}
              className="choice-input"
              onChange={() => handleToggle(option)}
            />
            <span className="choice-text">{option}</span>
          </label>
        );
      })}
    </div>
  );
};
