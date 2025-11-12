export interface SiteContent {
  header: {
    siteName: string;
    navLinks: {
      home: string;
      about: string;
      services: string;
      successStories: string;
      contact: string;
    };
    ctaButton: string;
  };
  hero: {
    headline1: string;
    headline2: string;
    subheading: string;
    ctaButton1: string;
    ctaButton2: string;
    stats: { value: string; label: string }[];
    imageUrl: string;
  };
  about: {
    headline1: string;
    headline2: string;
    paragraph1: string;
    paragraph2: string;
    certificationsTitle: string;
    certifications: { title: string; issuer: string }[];
    values: { icon: string; title: string; description: string }[];
    imageUrl: string;
  };
  services: {
    headline: string;
    subheading: string;
    plans: {
      popular: boolean;
      title: string;
      price: string;
      description: string;
      features: string[];
    }[];
  };
  consultation: {
    headline: string;
    subheading: string;
    buttonText: string;
  };
  testimonials: {
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
  };
  writeSuccessStory: {
    headline: string;
    paragraph: string;
    points: string[];
    buttonText: string;
    imageUrl: string;
  };
  intakeForm: {
    headline: string;
    subheading: string;
  };
  contact: {
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
  };
  footer: {
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
  };
}
