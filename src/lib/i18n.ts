import {
  locales,
  defaultLocale,
  type Locale,
  getLocaleFromPathname,
  removeLocaleFromPathname,
  addLocaleToPathname,
  getAlternateUrls,
  generateHreflangLinks,
  isValidLocale,
} from '../../i18n.config'

// Re-export types and utilities for easier importing
export {
  type Locale,
  defaultLocale,
  locales,
  getLocaleFromPathname,
  removeLocaleFromPathname,
  addLocaleToPathname,
  getAlternateUrls,
  generateHreflangLinks,
  isValidLocale
}

// Translation interface for type safety
export interface Translations {
  // Navigation
  nav: {
    home: string
    services: string
    about: string
    contact: string
    getStarted: string
    companyName: string
    homeAriaLabel: string
    menuAriaLabel: string
    openMenu: string
    closeMenu: string
  }
  
  // Homepage
  homepage: {
    meta: {
      title: string
      description: string
    }
    hero: {
      title: string
      subtitle: string
      description: string
      primaryCTA: string
      secondaryCTA: string
    }
    services: {
      title: string
      subtitle: string
      manufacturing: {
        title: string
        description: string
      }
      it: {
        title: string
        description: string
      }
      market: {
        title: string
        description: string
      }
    }
    features: {
      title: string
      subtitle: string
      dataExecution: {
        title: string
        description: string
      }
      handsOn: {
        title: string
        description: string
      }
      bilingual: {
        title: string
        description: string
      }
      practical: {
        title: string
        description: string
      }
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  
  // About page
  about: {
    meta: {
      title: string
      description: string
    }
    hero: {
      title: string
      subtitle: string
      description: string
    }
    mission: {
      title: string
      description: string
    }
    vision: {
      title: string
      description: string
    }
    values: {
      title: string
      subtitle: string
      excellence: {
        title: string
        description: string
      }
      integrity: {
        title: string
        description: string
      }
      innovation: {
        title: string
        description: string
      }
      collaboration: {
        title: string
        description: string
      }
    }
    leadership: {
      title: string
      subtitle: string
      founder: {
        name: string
        position: string
        bio: string
        expertiseTitle: string
        expertise: string[]
      }
    }
    timeline: {
      title: string
      subtitle: string
      milestones: Array<{
        year: string
        title: string
        description: string
      }>
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  
  // Services page
  services: {
    meta: {
      title: string
      description: string
    }
    hero: {
      title: string
      subtitle: string
      description: string
    }
    overview: {
      title: string
      subtitle: string
    }
    retail: {
      title: string
      description: string
      features: string[]
    }
    inventory: {
      title: string
      description: string
      features: string[]
    }
    analytics: {
      title: string
      description: string
      features: string[]
    }
    market: {
      title: string
      description: string
      features: string[]
    }
    industries: {
      title: string
      subtitle: string
      retail: {
        name: string
        description: string
        expertise: string[]
      }
      manufacturing: {
        name: string
        description: string
        expertise: string[]
      }
      smes: {
        name: string
        description: string
        expertise: string[]
      }
    }
    process: {
      title: string
      subtitle: string
      steps: Array<{
        step: string
        title: string
        description: string
      }>
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
  
  // Contact page
  contact: {
    meta: {
      title: string
      description: string
    }
    hero: {
      title: string
      subtitle: string
      description: string
    }
    form: {
      title: string
      name: string
      email: string
      message: string
      submit: string
      sending: string
      success: string
      error: string
      nameRequired: string
      emailRequired: string
      emailInvalid: string
      messageRequired: string
    }
    info: {
      title: string
      phone: {
        title: string
        number: string
        hours: string
      }
      email: {
        title: string
        address: string
        response: string
      }
      office: {
        title: string
        address: string
      }
      hours: {
        title: string
        weekdays: string
        saturday: string
        sunday: string
      }
    }
    services: {
      title: string
      subtitle: string
      manufacturing: {
        title: string
        description: string
      }
      it: {
        title: string
        description: string
      }
      market: {
        title: string
        description: string
      }
      exploreAll: string
    }
  }
  
  // Privacy page
  privacy: {
    meta: {
      title: string
      description: string
    }
    title: string
    lastUpdated: string
    sections: {
      overview: {
        title: string
        content: string[]
      }
      collection: {
        title: string
        personalInfo: {
          title: string
          description: string
          items: string[]
        }
        usage: {
          title: string
          description: string
        }
      }
      usage: {
        title: string
        content: string[]
      }
      sharing: {
        title: string
        content: string[]
      }
      security: {
        title: string
        content: string[]
      }
      transfers: {
        title: string
        content: string[]
      }
      rights: {
        title: string
        items: Array<{
          title: string
          description: string
        }>
        contact: string
      }
      children: {
        title: string
        content: string[]
      }
      contact: {
        title: string
        description: string
        email: string
        phone: string
        address: string
      }
      updates: {
        title: string
        content: string[]
      }
    }
  }
  
  // Footer
  footer: {
    companyName: string
    tagline: string
    quickLinks: string
    contact: string
    copyright: string
    social: {
      linkedin: string
      twitter: string
    }
    pages: {
      home: string
      services: string
      about: string
      contact: string
      privacy: string
    }
    sections: {
      services: {
        title: string
        links: {
          consulting: string
          planning: string
          optimization: string
          transformation: string
        }
      }
      company: {
        title: string
        links: {
          about: string
          team: string
          careers: string
          contact: string
        }
      }
      resources: {
        title: string
        links: {
          cases: string
          papers: string
          insights: string
          blog: string
        }
      }
    }
    legal: {
      privacy: string
      terms: string
    }
  }
  
  // Common/Shared
  common: {
    learnMore: string
    readMore: string
    backToTop: string
    loading: string
    error: string
    language: string
    japanese: string
    english: string
    exploreServices: string
    scheduleConsultation: string
    getStarted: string
    contactUs: string
    typicalWork: string
    specializations: string
  }

  // Structured Data
  structuredData: {
    about: {
      webPage: {
        name: string
        description: string
      }
      breadcrumb: {
        home: string
        about: string
      }
      person: {
        name: string
        alternateName: string
        jobTitle: string
        description: string
        companyName: string
        occupation: string
        skills: string[]
      }
      aboutPage: {
        name: string
        description: string
      }
    }
    services: {
      webPage: {
        name: string
        description: string
      }
      breadcrumb: {
        home: string
        services: string
      }
      audience: string
    }
  }

  // Admin panel
  admin: {
    generator: {
      title: string
      subtitle: string
      form: {
        contentGeneration: string
        topicLabel: string
        topicPlaceholder: string
        topicHelper: string
        keywordsLabel: string
        keywordsPlaceholder: string
        keywordsHelper: string
        referenceUrlLabel: string
        referenceUrlPlaceholder: string
        referenceUrlHelper: string
        instructionsLabel: string
        instructionsPlaceholder: string
        instructionsHelper: string
        modelLabel: string
        modelHelper: string
        modelNanoLabel: string
        modelMiniLabel: string
        modelFullLabel: string
        generateButton: string
        generating: string
      }
      content: {
        title: string
        placeholder: string
        placeholderSubtext: string
        copyButton: string
        clearButton: string
      }
      instructions: {
        title: string
        items: string[]
      }
      errors: {
        fallbackGeneration: string
        fallbackResponse: string
        default: string
        apiKey: string
        quota: string
        network: string
        errorTitle: string
        debugInfo: string
        unknownError: string
      }
    }
  }
}

// i18n configuration - imported from centralized config
export const i18nConfig = {
  locales,
  defaultLocale,
  localeDetection: true,
} as const
