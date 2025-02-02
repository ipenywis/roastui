import { Checkout } from '@/types/checkout';

const paymentService = {
  getCheckoutUrl: async (tier: string, plan: string): Promise<Checkout> => {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ tier, plan }),
    });

    if (!response.ok) {
      //eslint-disable-next-line no-console
      console.error('Failed to create checkout session');
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  },
};

export default paymentService;
