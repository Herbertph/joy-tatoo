// All site content lives here. Images flagged `placeholder: true` must be replaced by real studio photos.

export type PortfolioCategory = 'fine-line' | 'black-grey' | 'botanical' | 'traditional' | 'cover-up';

export interface TattooItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  alt: string;
  sessionTime: string;
  placeholder: boolean;
}

export interface SiteImage {
  src: string;
  alt: string;
  placeholder: boolean;
}

export const business = {
  name: 'Joy Tattoo',
  logo: 'JOY TATTOO',
  logoTagline: 'BOUTIQUE TATTOO STUDIO',
  address: '700 Main St Unit 303, Moncton, NB E1C 1E7',
  shortAddress: '700 Main St Unit 303, Moncton',
  // TODO: replace with the studio's real profile URLs.
  instagramUrl: 'https://www.instagram.com/joytattoo',
  facebookUrl: 'https://www.facebook.com/joytattoo',
};

export const topBar = {
  right: 'Downtown Moncton • Custom Ink & Walk-Ins',
  mobileBook: 'Book Online',
};

export const navLinks = [
  { label: 'HOME', href: '#home' },
  { label: 'PORTFOLIO', href: '#portfolio' },
  { label: 'ARTISTS', href: '#artists' },
  { label: 'AFTERCARE', href: '#aftercare' },
  { label: 'FAQ', href: '#faq' },
];

export const ctaLabel = 'BOOK A CONSULTATION';

export const hero = {
  eyebrow: 'CUSTOM TATTOO STUDIO IN MONCTON',
  titleLead: 'ART THAT STAYS.',
  titleAccent: 'STORIES IN INK.',
  subtitle: 'Moncton’s Boutique Tattoo Studio.',
  text: 'From delicate fine-line work to bold custom blackwork and colour pieces, we collaborate with you to bring meaningful art to life in a clean, welcoming Main Street studio.',
  primaryCta: 'BOOK A CONSULTATION',
  secondaryCta: 'VIEW PORTFOLIO',
  image: {
    src: '/images/hero.svg',
    alt: 'Tattoo artist applying fine-line work to a client’s forearm under warm focused light',
    placeholder: true,
  } satisfies SiteImage,
};

export const trustBar = {
  heading: 'Why Choose Joy Tattoo',
  ratingLabel: 'Rated 5 out of 5 stars',
  items: [
    {
      icon: 'stars',
      title: '5-Star Rated Studio',
      text: 'Trusted by clients across Greater Moncton for precision, comfort, and exceptional art.',
    },
    {
      icon: 'pen',
      title: 'Custom Art & Fine Line',
      text: 'One-of-a-kind designs tailored specifically to your anatomy, style preference, and story.',
    },
    {
      icon: 'shield',
      title: 'Hospital-Grade Sterilization',
      text: '100% single-use needles, Health Canada approved inks, and strict clinical hygiene protocols.',
    },
  ],
} as const;

export const portfolioSection = {
  eyebrow: 'SELECTED WORKS',
  heading: 'Crafted With Precision & Intention',
  text: 'Explore recent custom pieces, fine-line work, and healed tattoos created at our Main Street studio.',
  allLabel: 'All Work',
  cardButton: 'Request Similar Style',
  empty: 'New pieces in this style are coming soon.',
};

export const portfolioCategories: { id: PortfolioCategory; label: string; formStyle: string }[] = [
  { id: 'fine-line', label: 'Fine Line', formStyle: 'Fine Line' },
  { id: 'black-grey', label: 'Black & Grey', formStyle: 'Black & Grey' },
  { id: 'botanical', label: 'Botanical & Floral', formStyle: 'Botanical / Floral' },
  { id: 'traditional', label: 'Traditional & Bold', formStyle: 'Traditional / Bold' },
  { id: 'cover-up', label: 'Cover-Ups', formStyle: 'Cover-Up' },
];

export const portfolioItems: TattooItem[] = [
  {
    id: '1',
    title: 'Micro-Fine Line Botanical Forearm',
    category: 'fine-line',
    imageUrl: '/images/portfolio/botanical-fine-line.svg',
    alt: 'Delicate fine-line botanical stems tattooed along an inner forearm',
    sessionTime: '2.5 Hours',
    placeholder: true,
  },
  {
    id: '2',
    title: 'Fine Line Script Collarbone',
    category: 'fine-line',
    imageUrl: '/images/portfolio/script-fine-line.svg',
    alt: 'Thin handwritten script tattoo along a collarbone',
    sessionTime: '1 Hour',
    placeholder: true,
  },
  {
    id: '3',
    title: 'Black & Grey Realism Portrait',
    category: 'black-grey',
    imageUrl: '/images/portfolio/portrait-black-grey.svg',
    alt: 'Black and grey realistic portrait tattoo on an upper arm',
    sessionTime: '6 Hours',
    placeholder: true,
  },
  {
    id: '4',
    title: 'Shaded Wolf Calf Piece',
    category: 'black-grey',
    imageUrl: '/images/portfolio/wolf-black-grey.svg',
    alt: 'Soft-shaded black and grey wolf tattoo on a calf',
    sessionTime: '4 Hours',
    placeholder: true,
  },
  {
    id: '5',
    title: 'Peony & Leaf Shoulder Composition',
    category: 'botanical',
    imageUrl: '/images/portfolio/peony-botanical.svg',
    alt: 'Peony flowers and leaves flowing over a shoulder',
    sessionTime: '3.5 Hours',
    placeholder: true,
  },
  {
    id: '6',
    title: 'Fern Half-Sleeve',
    category: 'botanical',
    imageUrl: '/images/portfolio/fern-botanical.svg',
    alt: 'Layered fern leaves forming a half-sleeve tattoo',
    sessionTime: '5 Hours',
    placeholder: true,
  },
  {
    id: '7',
    title: 'Bold Traditional Swallow',
    category: 'traditional',
    imageUrl: '/images/portfolio/swallow-traditional.svg',
    alt: 'Bold-outlined traditional swallow tattoo with solid colour fill',
    sessionTime: '2 Hours',
    placeholder: true,
  },
  {
    id: '8',
    title: 'Blackwork Rose Cover-Up',
    category: 'cover-up',
    imageUrl: '/images/portfolio/rose-cover-up.svg',
    alt: 'Dark blackwork rose tattoo covering an older faded tattoo',
    sessionTime: '4.5 Hours',
    placeholder: true,
  },
];

export const pricingSection = {
  eyebrow: 'PRICING & SESSIONS',
  heading: 'Transparent Rates & Custom Quotes',
  text: 'Every custom tattoo is priced fairly based on size, placement, and level of detail.',
  badge: 'MOST REQUESTED',
  notice:
    'Deposit Policy Notice: A $50–$100 non-refundable deposit is required to secure your appointment date and goes directly toward the final price of your tattoo.',
};

export const pricingCards = [
  {
    title: 'Minimum & Small Pieces',
    price: 'Starting at $120 CAD',
    details:
      'Ideal for minimalist symbols, script, micro fine-line, or flash designs up to 2 inches. Includes sterile setup and custom stencil sizing.',
    button: 'Inquire Small Piece',
    size: 'Small (2–4")',
    featured: false,
  },
  {
    title: 'Custom Medium Piece',
    price: '$200 – $450 CAD',
    details:
      'Custom artwork designed from scratch (3 to 6 inches), forearm/calf pieces, botanical compositions, and shaded blackwork. Includes digital mockup review before session.',
    button: 'Start Custom Project',
    size: 'Medium (4–6")',
    featured: true,
  },
  {
    title: 'Half-Day & Full-Day Sessions',
    price: '$550 – $950 CAD',
    details:
      'Dedicated studio time for large-scale pieces, sleeves, back pieces, or complex cover-ups with priority scheduling.',
    button: 'Book Full Session',
    size: 'Large (6"+ / Sleeve)',
    featured: false,
  },
];

export const studioSection = {
  eyebrow: 'THE MONCTON STUDIO',
  heading: 'A Calm, Judgment-Free Space on Main Street',
  paragraphs: [
    'Located in the heart of Downtown Moncton at 700 Main Street (Unit 303), Joy Tattoo was created to offer a refreshing alternative to traditional, intimidating tattoo shops.',
    'We provide a clean, quiet, and welcoming atmosphere where you can feel entirely comfortable throughout your session. Whether it is your very first tattoo or an addition to a growing collection, we take the time to ensure your placement, sizing, and design are absolute perfection.',
  ],
  image: {
    src: '/images/studio.svg',
    alt: 'Quiet, softly lit tattoo station inside the Joy Tattoo studio',
    placeholder: true,
  } satisfies SiteImage,
};

export const careGuide = {
  eyebrow: 'CLIENT CARE GUIDE',
  heading: 'Before & After Your Session',
  text: 'Proper preparation and aftercare are essential for crisp lines and flawless healing.',
  tabs: [
    {
      id: 'before',
      label: 'Before Your Session',
      items: [
        {
          title: 'Hydration & Meals',
          text: 'Drink plenty of water in the 24 hours leading up to your appointment. Eat a full meal 1–2 hours before arriving to keep your blood sugar stable.',
        },
        {
          title: 'Skin Preparation',
          text: 'Avoid sunburns, heavy tanning, or harsh chemical peels on the target area. Do not shave the area yourself if you are prone to razor burn—we will prepare the skin safely.',
        },
        {
          title: 'Substance Restrictions',
          text: 'Do not consume alcohol or blood-thinning medications for at least 24 hours prior to your session.',
        },
        {
          title: 'What to Wear & Bring',
          text: 'Wear comfortable, dark clothing that allows easy, non-restrictive access to the tattoo placement. Bring a valid government-issued photo ID (18+ required).',
        },
      ],
    },
    {
      id: 'after',
      label: 'Healing & Aftercare',
      items: [
        {
          title: 'Bandage Care',
          text: 'Keep your second-skin protective bandage on for 3 to 5 days as directed by your artist. If fluid accumulates, this is completely normal.',
        },
        {
          title: 'Washing Instructions',
          text: 'Gently wash your healing tattoo twice daily using warm water and fragrance-free antibacterial soap. Pat dry with a clean paper towel—never rub.',
        },
        {
          title: 'Moisturizing',
          text: 'Apply a paper-thin layer of unscented moisturizer or specialized tattoo balm 2–3 times a day. Do not oversaturate the skin.',
        },
        {
          title: 'Activities to Avoid',
          text: 'No swimming, hot tubs, saunas, or prolonged soaking for 2–3 weeks. Avoid direct sun exposure and never pick or scratch healing skin.',
        },
      ],
    },
  ],
};

// Section headings below are not in the brief copy; kept short and neutral.
export const reviewsSection = { eyebrow: 'CLIENT REVIEWS', heading: 'What Our Clients Say' };

export const reviews = [
  {
    quote:
      'Got my first fine-line piece at Joy Tattoo on Main St and couldn’t be happier. Super clean studio, gentle hand, and healed crisply.',
    name: 'Camille R.',
    city: 'Moncton, NB',
  },
  {
    quote:
      'They took my rough idea and turned it into an incredible custom forearm design. Worth every penny—already planning my next session.',
    name: 'Tyler G.',
    city: 'Dieppe, NB',
  },
  {
    quote:
      'Very welcoming atmosphere and spotless stations. They walked me through every step of sizing and aftercare.',
    name: 'Hannah W.',
    city: 'Riverview, NB',
  },
];

export const faqSection = { eyebrow: 'GOOD TO KNOW', heading: 'Frequently Asked Questions' };

export const faqs = [
  {
    question: 'How do I book an appointment or get a price quote?',
    answer:
      'Simply fill out our online Consultation & Quote Form below. Provide details about your idea, size, placement, and reference images. We will review your request and respond via email or Instagram within 24–48 hours with a price estimate and available dates.',
  },
  {
    question: 'Do you accept walk-ins at your Main Street studio?',
    answer:
      'We operate primarily by appointment to ensure dedicated focus for each client. However, we do host select Walk-In days for flash designs, which are announced on our website banner and Instagram stories.',
  },
  {
    question: 'What is the minimum age to get tattooed in New Brunswick?',
    answer:
      'You must be at least 18 years of age. A valid government-issued photo ID (driver’s license or passport) is required at the time of your appointment. No exceptions or parental consent under 18.',
  },
  {
    question: 'Can you redesign or cover up an existing tattoo?',
    answer:
      'Yes! We specialize in custom cover-ups and reworks. Please attach clear, well-lit photos of your existing tattoo in the consultation form so we can evaluate your options.',
  },
  {
    question: 'How do deposits and rescheduling work?',
    answer:
      'A deposit ($50–$100) is required to lock in your date. Deposits are non-refundable but fully transferable to a new date if you provide at least 48 hours’ notice prior to your scheduled time.',
  },
];

export const bookingSection = {
  eyebrow: 'START YOUR PROJECT',
  heading: 'Book a Consultation or Request a Quote',
  text: 'Fill out the form below with your project details. We will review your request and contact you within 24–48 hours.',
  submit: 'SUBMIT TATTOO INQUIRY',
  sending: 'SENDING…',
  success:
    'Thank you for your inquiry! We have received your project details. Our team will review your reference images and respond via email or Instagram within 24–48 hours with an estimated quote and available consultation dates.',
  error: 'Sorry, we couldn’t send your inquiry. Please try again in a moment, or message us on Instagram.',
  bodyPlacementPlaceholder: 'e.g. Inner Forearm, Upper Arm, Ribs, Ankle',
  fileHelper: 'PNG or JPG, up to 5 MB each.',
  dropZone: 'Drag and drop images here, or',
  chooseFiles: 'choose files',
  ageText: 'I confirm I am 18 years of age or older and will bring a valid government photo ID.',
};

export const tattooStyles = [
  'Fine Line',
  'Black & Grey',
  'Colour',
  'Botanical / Floral',
  'Script / Lettering',
  'Traditional / Bold',
  'Cover-Up',
  'Flash Design',
];

export const approxSizes = ['Tiny (1–2")', 'Small (2–4")', 'Medium (4–6")', 'Large (6"+ / Sleeve)'];

export const budgetRanges = ['$120–$200', '$200–$450', '$450–$800', '$800+'];

export const footer = {
  tagline:
    'Custom tattoo studio located in Downtown Moncton, NB. Dedicated to precision fine-line, blackwork, and custom artwork in a sterile, welcoming space.',
  quickLinksHeading: 'Quick Links',
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Pricing & Session Guide', href: '#pricing' },
    { label: 'Artists & Studio', href: '#artists' },
    { label: 'Client Aftercare', href: '#aftercare' },
    { label: 'Frequently Asked Questions', href: '#faq' },
    { label: 'Book Consultation', href: '#booking' },
  ],
  areasHeading: 'Serving Greater Moncton',
  areas: ['Downtown Moncton', 'Dieppe, NB', 'Riverview, NB', 'Shediac, NB', 'Sackville, NB'],
  locationHeading: 'Studio Location & Hours',
  schedule: 'By Appointment & Select Walk-Ins',
  hours: ['Tuesday – Saturday: 11:00 AM – 7:00 PM', 'Sunday – Monday: Closed'],
  copyrightSuffix: 'Joy Tattoo. All rights reserved. | 700 Main St Unit 303, Moncton, NB.',
};
