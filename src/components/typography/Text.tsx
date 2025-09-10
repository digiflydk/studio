'use client';
import { ElementType, HTMLAttributes, forwardRef } from 'react';
import { Align, Weight, Color, alignMap, weightMap, colorMap } from './H1';
import { cn } from '@/lib/utils';

type Variant = 'body' | 'lead' | 'small' | 'caption';

const variantMap: Record<Variant, string> = {
  body: 'text-body',
  lead: 'text-lg md:text-xl',
  small: 'text-sm',
  caption: 'text-xs',
};

type Props = {
  as?: ElementType;
  variant?: Variant;
  align?: Align;
  weight?: Weight;
  color?: Color;
  muted?: boolean;
  noMargin?: boolean;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const Text = forwardRef<HTMLElement, Props>(function Text(
  {
    as: Tag = 'p',
    variant = 'body',
    align = 'left',
    weight = 'regular',
    color = 'default',
    muted,
    noMargin,
    className,
    ...rest
  },
  ref
) {
  const c = muted ? 'text-muted-foreground' : colorMap[color];
  return (
    <Tag
      ref={ref}
      className={cn(
        variantMap[variant],
        'leading-[var(--body-lh)]',
        alignMap[align],
        weightMap[weight],
        c,
        noMargin ? '' : 'mb-4',
        className
      )}
      {...rest}
    />
  );
});

export default Text;
