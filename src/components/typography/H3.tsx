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

const H3 = forwardRef<HTMLElement, Props>(function H3(
  { as: Tag = 'h3', align = 'left', weight = 'bold', color = 'default', noMargin, className, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'text-h3',
        alignMap[align],
        weightMap[weight],
        colorMap[color],
        noMargin ? '' : 'mb-3',
        className
      )}
      {...rest}
    />
  );
});

export default H3;
