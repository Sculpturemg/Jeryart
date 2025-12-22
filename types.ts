
export enum Language {
  FR = 'fr',
  MG = 'mg',
  EN = 'en',
  RU = 'ru'
}

export interface LocalizedText {
  fr: string;
  mg: string;
  en: string;
  ru: string;
  [key: string]: string;
}

export interface Sculpture {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  price: number; // Stored in Euro
  imageUrl: string;
  category: string;
  available: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedText;
  content: LocalizedText;
  imageUrl: string;
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: LocalizedText;
}

export interface SiteContent {
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImageUrl: string;
  aboutText: LocalizedText;
  commission: {
    title: LocalizedText;
    desc: LocalizedText;
  };
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  whatsapp: string;
  email: string;
  facebook: string; // New Facebook field
}

export type Dictionary = {
  [key in Language]: {
    nav: {
      home: string;
      gallery: string;
      blog: string;
      about: string;
      contact: string;
      admin: string;
    };
    hero: {
      cta: string;
    };
    commission: {
      cta: string;
    };
    gallery: {
      title: string;
      filterAll: string;
      details: string;
      order: string;
      unavailable: string;
      back: string;
    };
    blog: {
      title: string;
      readMore: string;
      back: string;
    };
    testimonials: {
      title: string;
    };
    contact: {
      title: string;
      desc: string;
      emailLabel: string;
      whatsappLabel: string;
      facebookLabel: string;
      sendEmail: string;
      sendWhatsapp: string;
      visitFacebook: string;
    };
    footer: {
      rights: string;
      followUs: string;
      quickLinks: string;
      contactUs: string;
    };
    admin: {
      title: string;
      login: string;
      dashboard: string;
      tabSculptures: string;
      tabBlog: string;
      tabReviews: string;
      tabSettings: string;
      addSculpture: string;
      addPost: string;
      addReview: string;
      edit: string;
      generateAI: string;
      save: string;
      cancel: string;
      delete: string;
      password: string;
      logout: string;
      uploadImage: string;
      orPasteUrl: string;
      settingsHero: string;
      settingsContact: string;
      settingsAbout: string;
      settingsCommission: string;
      settingsPassword: string;
      newPasswordPlaceholder: string;
    };
  };
};
