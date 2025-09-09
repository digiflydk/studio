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

export { default as H1 } from './H1';
export { default as H2 } from './H2';
export { default as H3 } from './H3';
export { default as H4 } from './H4';
export { default as Text } from './Text';
