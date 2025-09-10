'use client';
import { ElementType, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type Align = 'left' | 'center' | 'right';
export type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
export type Color = 'default' | 'muted' | 'primary' | 'secondary';

export const alignMap: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const weightMap: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const colorMap: Record<Color, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
};


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
