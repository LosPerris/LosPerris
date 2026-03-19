/// <reference path="../.astro/types.d.ts" />

interface Window {
  guideContent: Record<string, { title: string; content: string }>;
  openGuide: (id: string) => void;
  openSupportModal: () => void;
  emailjs: any;
}

declare var emailjs: any;
