'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './pricing.module.css';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShowcaseSection } from '../showcaseSection';
import { CheckIcon } from '../icons/checkIcon';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import { Subscription } from '@prisma/client';
import { useUser } from '@/lib/queryHooks/user/queries';

export interface PricingTierFrequency {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
  plan: string;
}

export interface PricingTier {
  name: string;
  id: string;
  href: string;
  discountPrice: Record<string, string>;
  price: Record<string, string>;
  description: string | React.ReactNode;
  features: string[];
  featured?: boolean;
  highlighted?: boolean;
  cta: string;
  soldOut?: boolean;
  comingSoon?: boolean;
  tier: string;
}

export const frequencies: PricingTierFrequency[] = [
  {
    id: '2',
    value: '2',
    label: 'Annually',
    priceSuffix: '/month',
    plan: 'yearly',
  },
  {
    id: '1',
    value: '1',
    label: 'Monthly',
    priceSuffix: '/month',
    plan: 'monthly',
  },
];

export const tiers: PricingTier[] = [
  {
    name: 'Starter',
    id: '0',
    href: '/subscribe',
    price: { '1': '$14.99', '2': '$12.99' },
    discountPrice: { '1': '', '2': '' },
    description: `Get a sense of RoastUI and become a better designer`,
    features: [
      `Unlimited designs`,
      `UI Design Playground`,
      `UI Design flaws`,
      `UI Design improvements`,
    ],
    featured: false,
    highlighted: true,
    soldOut: false,
    cta: `Sign up`,
    tier: 'starter',
  },
  {
    name: 'Pro',
    id: '1',
    href: '/subscribe',
    price: { '1': '$25', '2': '$20' },
    discountPrice: { '1': '', '2': '' },
    description: `When you grow, need more power and flexibility.`,
    features: [
      `All in the free plan plus`,
      `Customizable templates`,
      `Integration with third-party apps`,
    ],
    featured: true,
    highlighted: false,
    soldOut: false,
    cta: `Get started`,
    comingSoon: true,
    tier: 'pro',
  },
];

interface PricingProps {
  className?: string;
  mode: 'integrated' | 'standalone';
  subscription?: Subscription;
}

export function Pricing(props: PricingProps) {
  const { className, mode = 'integrated', subscription } = props;
  const [frequency, setFrequency] = useState(frequencies[0]);

  const session = useSession();

  const router = useRouter();

  const { data: userData } = useUser();
  const isSubscriptionActive = userData?.user?.subscription?.isActive ?? false;

  if (mode === 'standalone' && session.status === 'unauthenticated')
    return redirect('/login');

  if (mode === 'standalone' && subscription?.isActive)
    return redirect('/dashboard');

  if (mode === 'standalone' && isSubscriptionActive)
    return redirect('/dashboard');

  const buttonText = (tier: PricingTier) => {
    if (tier.soldOut) return 'Sold out';
    else if (tier.comingSoon) return 'Coming Soon...';
    else return tier.cta;
  };

  const getCheckoutUrl = async (
    e: React.MouseEvent<HTMLButtonElement>,
    tier: PricingTier,
  ) => {
    e.preventDefault();

    if (session.status === 'unauthenticated')
      return router.push(`/login?tier=${tier.tier}&plan=${frequency.plan}`);

    if (subscription?.isActive) return router.push('/dashboard');

    const checkout = await paymentService.getCheckoutUrl(
      tier.tier,
      frequency.plan,
    );

    window.location.href = checkout.checkoutUrl;
  };

  return (
    <ShowcaseSection
      id="pricing"
      title="Get Started Now"
      description="Save hours of moving buttons around and quickly find what's wrong with your designs with RoastUI"
      className={className}
    >
      <div
        className={cn(
          'flex flex-col w-full items-center dark relative',
          styles.fancyOverlay,
        )}
      >
        <div className="w-full flex flex-col items-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8  flex flex-col items-center">
            {frequencies.length > 1 ? (
              <div className="mt-2 mb-8 flex justify-center">
                <RadioGroup
                  defaultValue={frequency.value}
                  onValueChange={(value: string) => {
                    setFrequency(frequencies.find((f) => f.value === value)!);
                  }}
                  className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
                  style={{
                    gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
                  }}
                >
                  <Label className="sr-only">Payment frequency</Label>
                  {frequencies.map((option) => (
                    <Label
                      className={cn(
                        frequency.value === option.value
                          ? 'bg-sky-500/90 text-white dark:bg-sky-900/70 dark:text-white/70'
                          : 'bg-transparent text-gray-500 hover:bg-sky-500/10',
                        'cursor-pointer rounded-full px-2.5 py-2 transition-all relative',
                      )}
                      key={option.value}
                      htmlFor={option.value}
                    >
                      {option.label}
                      {option.value === '2' && (
                        <span className="absolute -top-2 -left-1.5 text-[10px] bg-green-500 text-white dark:text-white px-1.5 py-0.5 rounded-full font-medium text-center min-w-[30px] shadow-sm">
                          -13%
                        </span>
                      )}
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="hidden"
                      />
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="mt-12" aria-hidden="true"></div>
            )}

            <div
              className={cn(
                'isolate mx-auto mt-4 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none',
                tiers.length === 2 ? 'lg:grid-cols-2' : '',
                tiers.length === 3 ? 'lg:grid-cols-3' : '',
              )}
            >
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    tier.featured
                      ? '!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100'
                      : 'bg-white dark:bg-gray-900/80 ring-gray-300/70 dark:ring-gray-700',
                    'max-w-xs ring-1 rounded-3xl p-8 xl:p-10',
                    tier.highlighted ? styles.fancyGlassContrast : '',
                  )}
                >
                  <h3
                    id={tier.id}
                    className={cn(
                      tier.featured
                        ? 'text-white dark:text-black'
                        : 'text-black dark:text-white',
                      'text-2xl font-bold tracking-tight',
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={cn(
                      tier.featured
                        ? 'text-gray-300 dark:text-gray-500'
                        : 'text-gray-600 dark:text-gray-400',
                      'mt-4 text-sm leading-6',
                    )}
                  >
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span
                      className={cn(
                        tier.featured
                          ? 'text-white dark:text-black'
                          : 'text-black dark:text-white',
                        'text-4xl font-bold tracking-tight',
                        tier.discountPrice &&
                          tier.discountPrice[frequency.value]
                          ? 'line-through'
                          : '',
                        tier.comingSoon ? 'line-through' : '',
                      )}
                    >
                      {typeof tier.price === 'string'
                        ? tier.price
                        : tier.price[frequency.value]}
                    </span>

                    <span
                      className={cn(
                        tier.featured
                          ? 'text-white dark:text-black'
                          : 'text-black dark:text-white',
                      )}
                    >
                      {typeof tier.discountPrice === 'string'
                        ? tier.discountPrice
                        : tier.discountPrice[frequency.value]}
                    </span>

                    {typeof tier.price !== 'string' ? (
                      <span
                        className={cn(
                          tier.featured
                            ? 'text-gray-300 dark:text-gray-500'
                            : 'dark:text-gray-400 text-gray-600',
                          'text-sm font-semibold leading-6',
                        )}
                      >
                        {frequency.priceSuffix}
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={cn(
                      'flex mt-6 shadow-sm',
                      tier.soldOut || tier.comingSoon
                        ? 'pointer-events-none'
                        : '',
                    )}
                  >
                    <Button
                      size="lg"
                      disabled={tier.soldOut || tier.comingSoon}
                      className={cn(
                        'w-full text-black dark:text-white',
                        !tier.highlighted && !tier.featured
                          ? 'bg-gray-100 dark:bg-gray-600'
                          : 'bg-sky-300 hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-700',
                        tier.featured || tier.soldOut
                          ? 'bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black'
                          : 'hover:opacity-80 transition-opacity',
                      )}
                      variant={tier.highlighted ? 'default' : 'outline'}
                      onClick={(e) => getCheckoutUrl(e, tier)}
                    >
                      {buttonText(tier)}
                    </Button>
                  </a>

                  <ul
                    className={cn(
                      tier.featured
                        ? 'text-gray-300 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-400',
                      'mt-8 space-y-3 text-sm leading-6 xl:mt-10',
                    )}
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          className={cn(
                            tier.featured ? 'text-white dark:text-black' : '',
                            tier.highlighted ? 'text-sky-500' : 'text-gray-500',

                            'h-6 w-5 flex-none',
                          )}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  );
}
