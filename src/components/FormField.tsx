import React from 'react';
import {QuestionDefinition} from '../data/questions';
import {CheckboxGroup} from './CheckboxGroup';
import {RatingScale} from './RatingScale';

interface FormFieldProps {
  question: QuestionDefinition;
  value: string | number | string[] | null;
  error?: string;
  onChange: (value: string | number | string[] | null) => void;
  onBlur: () => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  question,
  value,
  error,
  onChange,
  onBlur,
}) => {
  const {id, text, required, type, minLabel, maxLabel, options, placeholder, helperText, maxLength} =
    question;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const controlId = `${id}-control`;
  const hasError = Boolean(error);

  const isFieldsetType =
    type === 'rating-5' ||
    type === 'rating-10' ||
    type === 'radio' ||
    type === 'checkbox';

  const labelContent = (
    <>
      <span>{id}. {text}</span>
      {required && (
        <span className="required-asterisk" aria-hidden="true">
          {' '}*
        </span>
      )}
    </>
  );

  const handleRadioGroupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      onBlur();
    }
  };

  if (isFieldsetType) {
    return (
      <div className="question-block" data-question-id={id}>
        <fieldset className="question-fieldset">
          <legend className="question-label">{labelContent}</legend>
          {helperText && (
            <p id={helperId} className="question-helper">
              {helperText}
            </p>
          )}

          {type === 'rating-5' && (
            <RatingScale
              questionId={id}
              min={1}
              max={5}
              value={typeof value === 'number' ? value : null}
              minLabel={minLabel ?? '1'}
              maxLabel={maxLabel ?? '5'}
              showStars
              hasError={hasError}
              errorId={errorId}
              onChange={(num) => onChange(num)}
              onBlur={onBlur}
            />
          )}

          {type === 'rating-10' && (
            <RatingScale
              questionId={id}
              min={0}
              max={10}
              value={typeof value === 'number' ? value : null}
              minLabel={minLabel ?? '0'}
              maxLabel={maxLabel ?? '10'}
              hasError={hasError}
              errorId={errorId}
              onChange={(num) => onChange(num)}
              onBlur={onBlur}
            />
          )}

          {type === 'radio' && options && (
            <div
              className="choice-list"
              role="radiogroup"
              aria-invalid={hasError ? 'true' : undefined}
              aria-describedby={hasError ? errorId : undefined}
              onBlur={handleRadioGroupBlur}
            >
              {options.map((option, idx) => {
                const isChecked = value === option;
                const optionId = idx === 0 ? controlId : `${id}-option-${idx}`;
                return (
                  <label
                    key={option}
                    htmlFor={optionId}
                    className={`choice-item${isChecked ? ' is-checked' : ''}`}
                  >
                    <input
                      id={optionId}
                      type="radio"
                      name={id}
                      value={option}
                      checked={isChecked}
                      className="choice-input"
                      onChange={() => onChange(option)}
                    />
                    <span className="choice-text">{option}</span>
                  </label>
                );
              })}
            </div>
          )}

          {type === 'checkbox' && options && (
            <CheckboxGroup
              questionId={id}
              options={options}
              selectedValues={Array.isArray(value) ? value : []}
              hasError={hasError}
              errorId={errorId}
              onChange={(next) => onChange(next)}
              onBlur={onBlur}
            />
          )}
        </fieldset>

        {hasError && (
          <p id={errorId} className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const stringVal = typeof value === 'string' ? value : '';
  const describedByParts: string[] = [];
  if (helperText) describedByParts.push(helperId);
  if (hasError) describedByParts.push(errorId);
  const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  return (
    <div className="question-block" data-question-id={id}>
      <label htmlFor={controlId} className="question-label">
        {labelContent}
      </label>

      {helperText && (
        <p id={helperId} className="question-helper">
          {helperText}
        </p>
      )}

      {type === 'textarea' && (
        <>
          <textarea
            id={controlId}
            name={id}
            rows={3}
            maxLength={maxLength ?? 1000}
            value={stringVal}
            aria-required={required ? 'true' : undefined}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={describedBy}
            className={`textarea-input${hasError ? ' input-error' : ''}`}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
          <div className="textarea-footer">
            {hasError && (
              <p id={errorId} className="field-error" role="alert">
                {error}
              </p>
            )}
            <span className="char-counter" aria-live="polite">
              {stringVal.length} / {maxLength ?? 1000}
            </span>
          </div>
        </>
      )}

      {type === 'select' && options && (
        <>
          <select
            id={controlId}
            name={id}
            value={stringVal}
            aria-required={required ? 'true' : undefined}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={describedBy}
            className={`select-input${hasError ? ' input-error' : ''}`}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          >
            <option value="">{placeholder ?? 'Select one'}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {hasError && (
            <p id={errorId} className="field-error" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      {type === 'email' && (
        <>
          <input
            id={controlId}
            name={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={stringVal}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={describedBy}
            className={`text-input${hasError ? ' input-error' : ''}`}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
          {hasError && (
            <p id={errorId} className="field-error" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
};
