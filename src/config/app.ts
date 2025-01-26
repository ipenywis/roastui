const appConfig = {
  APP_URL: process.env.APP_URL,
  navigationMenu: [
    {
      item: 'Home',
      url: '/',
    },
    {
      item: 'Pricing',
      url: '/#pricing',
    },
    {
      item: 'About',
      url: '/about',
    },
    {
      item: 'FAQ',
      url: '/#faq',
    },
  ],
  faq: [
    {
      question: 'What types of designs can I upload to the platform?',
      answer:
        'You can upload any UI/UX design images, including website designs, mobile app interfaces, software dashboards, and more. We recommend uploading high-quality specific images for the best results',
    },
    {
      question: 'What file formats are supported for design uploads?',
      answer:
        'Our platform supports various image file formats, including JPEG, PNG, and SVG.',
    },
    {
      question:
        'Can the AI provide detailed feedback on specific design elements?',
      answer:
        'Yes, the AI provides detailed feedback on specific design elements such as layout, color schemes, typography, and overall usability.',
    },
    {
      question:
        'How long does it take to analyze a design and receive feedback?',
      answer:
        "The analysis typically takes from a few seconds to a little over a minute, depending on the complexity of the design. You'll receive feedback shortly after uploading your design.",
    },
    {
      question: "How accurate are the AI's design recommendations?",
      answer:
        "The AI's recommendations are based on established UI/UX design principles and best practices, but the final decision always lies with the designer. You can always roast the design again if you don't like the result. Please note that the AI is not perfect and sometimes it might not be able to provide the best recommendations or make mistakes. We will always continue to improve the AI to provide the best possible results.",
    },
    {
      question: 'Is there a limit to the number of designs I can upload?',
      answer:
        'Our platform offers various subscription plans, each with different limits on the number of designs you can upload and analyze. Please check our pricing page for more details.',
    },
    {
      question: 'Is my uploaded design data secure and confidential?',
      answer:
        'Yes, we take data security and confidentiality very seriously. All uploaded designs are securely stored and processed, and we do not share your data with third parties.',
    },
    {
      question: 'Can I integrate this tool with other design software?',
      answer:
        'We are working on integrations with popular design software tools. Please check our check back later for the latest updates (or contact us if you want to be the first to know).',
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        "Unfortunately, we don't offer a free trial. If you think a free trial would be useful, please let us know and we'll consider it.",
    },
    {
      question: 'How can I get support if I encounter issues?',
      answer:
        'You can reach our support team by emailing us directly. We are here to help you with any questions or issues you may have.',
    },
    {
      question: 'How can I contact you?',
      answer:
        'You can contact us by emailing us directly at hello@roastui.design',
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        'Yes, you can cancel your subscription at any time. You can do this by clicking on your profile dropdown menu, select billing and then you can manage your subscription on Stripe.',
    },
  ],
  socialLinks: {
    coderOneYoutube: 'https://youtube.com/coderone',
    x: 'https://x.com/ipenywis',
    githubProfile: 'https://github.com/ipenywis',
    githubProject: 'https://github.com/ipenywis/roastui',
  },
  contact: {
    supportEmail: 'support@roastui.design',
    generalInquiryEmail: 'hello@roastui.design',
  },
};

export default appConfig;
