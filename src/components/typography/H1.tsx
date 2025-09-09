'use client';
import { ElementType, HTMLAttributes, forwardRef } from 'react';
import { Align, Weight, Color, alignMap, weightMap, colorMap } from './index';
import { cn } from '@/lib/utils';

type Props = {
  as?: ElementType;
  align?: Align;
  weight?: Weight;
  color?: Color;
  noMargin?: boolean;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const H1 = forwardRef<HTMLElement, Props>(function H1(
  { as: Tag = 'h1', align = 'left', weight = 'bold', color = 'default', noMargin, className, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'text-h1 leading-[var(--h1-lh)]',
        alignMap[align],
        weightMap[weight],
        colorMap[color],
        noMargin ? '' : 'mb-4',
        className
      )}
      {...rest}
    />
  );
});

export default H1;
