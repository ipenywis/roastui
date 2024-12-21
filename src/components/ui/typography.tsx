import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      danger: 'text-red-500',
      success: 'text-success',
    },
  },
  defaultVariants: {
    variant: 'p',
    color: 'default',
  },
});

interface TypographyProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'div' | 'span';
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, as = 'p', children, ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant, color, className }))}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
