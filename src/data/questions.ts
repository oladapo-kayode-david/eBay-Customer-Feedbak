export type QuestionId =
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'Q5'
  | 'Q6'
  | 'Q7'
  | 'Q8'
  | 'Q9'
  | 'Q10'
  | 'Q11'
  | 'Q12';

export type QuestionType =
  | 'rating-5'
  | 'rating-10'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'email';

export interface QuestionDefinition {
  id: QuestionId;
  text: string;
  required: boolean;
  type: QuestionType;
  minLabel?: string;
  maxLabel?: string;
  options?: string[];
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
}

export const NONE_OPTION = 'None of these';

export const QUESTIONS: QuestionDefinition[] = [
  {
    id: 'Q1',
    text: 'Overall, how satisfied are you with your eBay shopping experience?',
    required: true,
    type: 'rating-5',
    minLabel: '1 = Very dissatisfied',
    maxLabel: '5 = Very satisfied',
  },
  {
    id: 'Q2',
    text: 'What is the primary reason for your satisfaction rating?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
  },
  {
    id: 'Q3',
    text: 'How likely are you to recommend shopping on eBay to a friend or colleague?',
    required: true,
    type: 'rating-10',
    minLabel: '0 = Not at all likely',
    maxLabel: '10 = Extremely likely',
  },
  {
    id: 'Q4',
    text: 'What is the main reason for your recommendation score?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
  },
  {
    id: 'Q5',
    text: "Did the item condition and delivery match the seller's listing description?",
    required: true,
    type: 'radio',
    options: ['Yes', 'Partly', 'No'],
  },
  {
    id: 'Q6',
    text: 'What specific aspects of the item condition, packaging, or delivery could be improved?',
    required: false,
    type: 'textarea',
    maxLength: 1000,
  },
  {
    id: 'Q7',
    text: "How do you rate eBay's pricing, seller fees, and overall value for money?",
    required: true,
    type: 'rating-5',
    minLabel: '1 = Poor value',
    maxLabel: '5 = Excellent value',
  },
  {
    id: 'Q8',
    text: 'Which other shopping platforms do you use regularly? (pick as many as apply)',
    required: false,
    type: 'checkbox',
    options: [
      'Amazon',
      'Walmart',
      'Temu',
      'AliExpress',
      'Etsy',
      'Shein',
      'Facebook Marketplace',
      'Alibaba',
      'Jumia',
      'Konga',
      'Other',
      NONE_OPTION,
    ],
  },
  {
    id: 'Q9',
    text: 'What do other platforms do better than eBay?',
    required: false,
    type: 'textarea',
    maxLength: 1000,
  },
  {
    id: 'Q10',
    text: 'What area should eBay prioritize improving most?',
    required: true,
    type: 'select',
    placeholder: 'Select one',
    options: [
      'Item quality and listing accuracy',
      'Delivery speed and tracking',
      'Packaging',
      'Pricing and fees',
      'Seller communication',
      'Returns and refunds',
      'Buyer protection and dispute resolution',
      'Search and app experience',
      'Customer support',
      'Other',
    ],
  },
  {
    id: 'Q11',
    text: 'What is the single most important improvement eBay should make to enhance your experience?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
  },
  {
    id: 'Q12',
    text: 'Email address (optional)',
    required: false,
    type: 'email',
    helperText: 'Only if you would like us to follow up.',
  },
];
