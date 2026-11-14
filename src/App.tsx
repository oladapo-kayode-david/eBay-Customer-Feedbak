import React, {useMemo, useState} from 'react';
import {FormField} from './components/FormField';
import {ThankYou} from './components/ThankYou';
import {QUESTIONS, QuestionDefinition, QuestionId} from './data/questions';

// Paste your deployed Google Apps Script Web App URL below
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzst-3niDwRbZLojuyLQhlII6OJvigWhlbIGKvB6rKrngdm6yfByAK9zaM9nL66IJ1vCQ/exec';

const isPlaceholderAppsScriptUrl = (url: string): boolean => {
  const trimmed = url.trim();
  return (
    !trimmed ||
    trimmed.includes('PASTE_YOUR') ||
    trimmed.includes('YOUR_SCRIPT_ID') ||
    trimmed === 'PLACEHOLDER'
  );
};

type AnswerValue = string | number | string[] | null;
type FormAnswers = Record<QuestionId, AnswerValue>;
type FormErrors = Partial<Record<QuestionId, string>>;

const INITIAL_ANSWERS: FormAnswers = {
  Q1: null,
  Q2: '',
  Q3: null,
  Q4: '',
  Q5: '',
  Q6: '',
  Q7: null,
  Q8: [],
  Q9: '',
  Q10: '',
  Q11: '',
  Q12: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isQuestionAnswered(
  question: QuestionDefinition,
  value: AnswerValue
): boolean {
  if (question.type === 'rating-5' || question.type === 'rating-10') {
    return typeof value === 'number' && !Number.isNaN(value);
  }
  if (question.type === 'checkbox') {
    return Array.isArray(value) && value.length > 0;
  }
  return typeof value === 'string' && value.trim().length > 0;
}

function validateQuestion(
  question: QuestionDefinition,
  value: AnswerValue
): string | undefined {
  if (question.required && !isQuestionAnswered(question, value)) {
    return 'Please answer this question';
  }
  if (question.id === 'Q12' && typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0 && !EMAIL_REGEX.test(trimmed)) {
      return 'Please enter a valid email address';
    }
  }
  return undefined;
}

export default function App() {
  const [answers, setAnswers] = useState<FormAnswers>(INITIAL_ANSWERS);
  const [errors, setErrors] = useState<FormErrors>({});
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showDevWarning = isPlaceholderAppsScriptUrl(APPS_SCRIPT_URL);

  const requiredQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.required),
    []
  );

  const answeredRequiredCount = useMemo(
    () =>
      requiredQuestions.filter((q) => isQuestionAnswered(q, answers[q.id]))
        .length,
    [requiredQuestions, answers]
  );

  const handleFieldChange = (
    question: QuestionDefinition,
    nextValue: AnswerValue
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: nextValue,
    }));

    if (errors[question.id]) {
      const nextError = validateQuestion(question, nextValue);
      setErrors((prev) => {
        const updated = {...prev};
        if (nextError) {
          updated[question.id] = nextError;
        } else {
          delete updated[question.id];
        }
        return updated;
      });
    }

    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleFieldBlur = (question: QuestionDefinition) => {
    const fieldError = validateQuestion(question, answers[question.id]);
    setErrors((prev) => {
      const updated = {...prev};
      if (fieldError) {
        updated[question.id] = fieldError;
      } else {
        delete updated[question.id];
      }
      return updated;
    });
  };

  const focusFirstInvalidField = (firstInvalidId: QuestionId) => {
    const controlEl = document.getElementById(`${firstInvalidId}-control`);
    const blockEl = document.querySelector<HTMLElement>(
      `[data-question-id="${firstInvalidId}"]`
    );

    if (blockEl) {
      blockEl.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    if (controlEl) {
      window.setTimeout(() => {
        controlEl.focus({preventScroll: true});
      }, 250);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: FormErrors = {};
    let firstInvalidId: QuestionId | null = null;

    for (const question of QUESTIONS) {
      const fieldError = validateQuestion(question, answers[question.id]);
      if (fieldError) {
        nextErrors[question.id] = fieldError;
        if (!firstInvalidId) {
          firstInvalidId = question.id;
        }
      }
    }

    setErrors(nextErrors);

    if (firstInvalidId) {
      focusFirstInvalidField(firstInvalidId);
      return;
    }

    // Honeypot check: silently pretend success if filled
    if (website.trim().length > 0) {
      setIsSubmitted(true);
      return;
    }

    if (showDevWarning) {
      setSubmitError(
        'Developer notice: APPS_SCRIPT_URL is not configured yet. Please paste your deployed Google Apps Script Web App URL.'
      );
      return;
    }

    const payload = {
      Q1: typeof answers.Q1 === 'number' ? answers.Q1 : 0,
      Q2: typeof answers.Q2 === 'string' ? answers.Q2.trim() : '',
      Q3: typeof answers.Q3 === 'number' ? answers.Q3 : 0,
      Q4: typeof answers.Q4 === 'string' ? answers.Q4.trim() : '',
      Q5: typeof answers.Q5 === 'string' ? answers.Q5.trim() : '',
      Q6: typeof answers.Q6 === 'string' ? answers.Q6.trim() : '',
      Q7: typeof answers.Q7 === 'number' ? answers.Q7 : 0,
      Q8: Array.isArray(answers.Q8) ? answers.Q8 : [],
      Q9: typeof answers.Q9 === 'string' ? answers.Q9.trim() : '',
      Q10: typeof answers.Q10 === 'string' ? answers.Q10.trim() : '',
      Q11: typeof answers.Q11 === 'string' ? answers.Q11.trim() : '',
      Q12: typeof answers.Q12 === 'string' ? answers.Q12.trim() : '',
      website,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(
        'Something went wrong. Please check your connection and try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a
            href="https://www.ebay.com"
            className="logo-link"
            aria-label="eBay Home"
          >
            <img
              src="https://i.ibb.co/4RDMc9Qg/download.png"
              alt="eBay"
              className="logo-img"
              referrerPolicy="no-referrer"
            />
          </a>
          <span className="header-divider" aria-hidden="true" />
          <h1 className="header-title">Customer Feedback</h1>
        </div>
      </header>

      <section className="hero-band" aria-labelledby="hero-heading">
        <div className="hero-band-inner">
          <h2 id="hero-heading" className="hero-heading">
            How was your eBay experience?
          </h2>
          <p className="hero-subtitle">
            Your feedback helps us improve. It takes about 3 minutes.
          </p>
        </div>
      </section>

      <main className="main-content">
        {isSubmitted ? (
          <ThankYou />
        ) : (
          <div className="feedback-card">
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">
                  {answeredRequiredCount} of {requiredQuestions.length} required
                  questions answered
                </span>
                <p className="required-note">
                  <span className="required-asterisk" aria-hidden="true">
                    *
                  </span>{' '}
                  Required
                </p>
              </div>
              <progress
                className="progress-bar"
                value={answeredRequiredCount}
                max={requiredQuestions.length}
                aria-label="Required questions progress"
              />
            </div>

            <form
              className="feedback-form"
              noValidate
              onSubmit={handleSubmit}
            >
              {showDevWarning && (
                <div className="dev-warning-banner" role="status">
                  <strong>Developer Warning</strong>
                  APPS_SCRIPT_URL is still set to a placeholder. Update the
                  constant in App.tsx with your deployed Google Apps Script Web
                  App URL before collecting responses.
                </div>
              )}

              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="website-honeypot">Website</label>
                <input
                  id="website-honeypot"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="form-questions">
                {QUESTIONS.map((question) => (
                  <FormField
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    error={errors[question.id]}
                    onChange={(val) => handleFieldChange(question, val)}
                    onBlur={() => handleFieldBlur(question)}
                  />
                ))}
              </div>

              {submitError && (
                <div className="submit-error-banner" role="alert">
                  {submitError}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-pill-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="spinner" aria-hidden="true" />
                  )}
                  <span>
                    {isSubmitting ? 'Submitting...' : 'Submit feedback'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <p className="footer-text">
          Copyright 2026 eBay Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
