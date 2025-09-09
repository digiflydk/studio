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

const H4 = forwardRef<HTMLElement, Props>(function H4(
  { as: Tag = 'h4', align = 'left', weight = 'bold', color = 'default', noMargin, className, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'text-h4 leading-[var(--h4-lh)]',
        alignMap[align],
        weightMap[weight],
        colorMap[color],
        noMargin ? '' : 'mb-2.5',
        className
      )}
      {...rest}
    />
  );
});

export default H4;
