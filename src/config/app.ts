const appConfig = {
  APP_URL: process.env.APP_URL,
  navigationMenu: [
    {
      item: 'Home',
      url: '/',
    },
    {
      item: 'Pricing',
      url: '#pricing',
    },
    {
      item: 'About',
      url: '/about',
    },
    {
      item: 'FAQ',
      url: '#faq',
    },
  ],
  faq: [
    {
      question: 'What types of designs can I upload to the platform?',
      answer:
        'You can upload any UI/UX design images, including website designs, mobile app interfaces, software dashboards, and more.',
    },
    {
      question: 'What file formats are supported for design uploads?',
      answer:
        'Our platform supports various image file formats, including JPEG, PNG, and SVG.',
    },
    {
      question: 'How does the AI analyze my design?',
      answer:
        'Our AI uses advanced machine learning algorithms trained on UI/UX design principles to identify flaws and recommend improvements.',
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
        "The analysis typically takes a few minutes, depending on the complexity of the design. You'll receive feedback shortly after uploading your design.",
    },
    {
      question:
        'Will the AI suggest a completely new design, or will it improve the existing one?',
      answer:
        'The AI will provide recommendations to improve your existing design and can also suggest a completely new design starting from your original concept.',
    },
    {
      question: 'Can I customize the AI-generated design suggestions?',
      answer:
        'Yes, you can customize the AI-generated design suggestions to better fit your preferences and specific project requirements.',
    },
    {
      question: "How accurate are the AI's design recommendations?",
      answer:
        "The AI's recommendations are based on established UI/UX design principles and best practices, but the final decision always lies with the designer. Our users report high satisfaction with the accuracy and usefulness of the recommendations.",
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
        'We are working on integrations with popular design software tools. Please check our integration page for the latest updates.',
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        "Yes, we offer a free trial so you can experience the platform's features and benefits before committing to a subscription plan.",
    },
    {
      question: 'How can I get support if I encounter issues?',
      answer:
        'You can reach our support team through the contact form on our website, or by emailing us directly. We are here to help you with any questions or issues you may have.',
    },
    {
      question: 'Can teams collaborate on designs using your platform?',
      answer:
        'Yes, our platform supports team collaboration, allowing multiple users to upload, analyze, and work on designs together.',
    },
    {
      question:
        'Are there any tutorials or guides available to help me get started?',
      answer:
        'Yes, we provide comprehensive tutorials and guides to help you get started with our platform. You can find these resources in the Help section of our website.',
    },
  ],
  socialLinks: {
    coderOneYoutube: 'https://youtube.com/coderone',
    x: 'https://x.com/ipenywis',
    githubProfile: 'https://github.com/ipenywis',
    githubProject: 'https://github.com/ipenywis/roastui',
  },
};

export default appConfig;
