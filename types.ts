
export interface NavLink {
  text: string;
  href: string;
}

export interface HeaderContent {
  siteName: string;
  navLinks: NavLink[];
  ctaButton: string;
}

export interface HeroContent {
  headline1: string;
  headline2: string;
  subheading: string;
  ctaButton1: string;
  ctaButton2: string;
  stats: { value: string; label: string }[];
  imageUrl: string;
}

export interface AboutContent {
  headline1: string;
  headline2: string;
  paragraph1: string;
  paragraph2: string;
  certificationsTitle: string;
  certifications: { title: string; issuer: string }[];
  values: { icon: string; title: string; description: string }[];
  imageUrl: string;
}

export interface ServicesContent {
  headline: string;
  subheading: string;
  plans: {
    popular: boolean;
    title: string;
    price: string;
    description: string;
    features: string[];
  }[];
}

export interface ConsultationContent {
  headline: string;
  subheading: string;
  buttonText: string;
}

export interface TestimonialsContent {
  headline: string;
  subheading: string;
  stories: {
    name: string;
    achievement: string;
    quote: string;
    imageUrl: string;
    avatarUrl: string;
    tag: string;
  }[];
}

export interface WriteSuccessStoryContent {
  headline: string;
  paragraph: string;
  points: string[];
  buttonText: string;
  imageUrl: string;
}

export interface IntakeFormField {
    id: string; // Maps to DB column name
    label: string;
    type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox-group';
    placeholder?: string;
    required: boolean;
    width: 'full' | 'half';
    options?: string[]; // For select and checkbox-group
}

export interface IntakeFormSection {
    id: string;
    title: string;
    icon: string; // Icon name from Icons.tsx
    fields: IntakeFormField[];
}

export interface IntakeFormContent {
  headline: string;
  subheading: string;
  sections: IntakeFormSection[];
  submitButtonText: string;
  disclaimer: string;
  notificationEmail?: string;
}

export interface ContactContent {
  headline: string;
  subheading: {
    line1: string;
    line2: string;
  };
  connect: {
    title: string;
    paragraph: string;
  };
  details: {
    email: { address: string; note: string };
    phone: { number: string; note: string };
    location: { name: string; address: string; note: string };
    availability: string[];
  };
  guarantee: {
    title: string;
    text: string;
  };
  form: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    buttonText: string;
  };
  notificationEmail?: string;
}

export interface VideoContent {
    headline: string;
    subheading: string;
    videoId: string;
}

export interface FooterContent {
  tagline: string;
  quickLinks: {
    title: string;
    getStarted: string;
    admin: string;
  };
  services: {
    title: string;
    list: string[];
  };
  contact: {
    title: string;
    hoursTitle: string;
  };
  copyright: string;
}

export type SectionContent =
  | HeroContent
  | AboutContent
  | ServicesContent
  | ConsultationContent
  | TestimonialsContent
  | WriteSuccessStoryContent
  | IntakeFormContent
  | ContactContent
  | VideoContent;

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'consultation'
  | 'testimonials'
  | 'writeSuccessStory'
  | 'intakeForm'
  | 'contact'
  | 'video';

export interface Section {
  id: string;
  type: SectionType;
  content: SectionContent;
}

export interface SiteContent {
  header: HeaderContent;
  sections: Section[];
  footer: FooterContent;
}