import React, {useEffect} from 'react';

export const ThankYou: React.FC = () => {
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  return (
    <section className="thank-you-card" aria-labelledby="thank-you-heading">
      <div className="thank-you-icon" aria-hidden="true">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 id="thank-you-heading" className="thank-you-heading">
        Thank you for your feedback!
      </h2>
      <p className="thank-you-text">
        We really appreciate you taking the time to help us improve your eBay experience.
      </p>
      <a href="https://www.ebay.com" className="primary-pill-btn">
        Back to eBay
      </a>
    </section>
  );
};
