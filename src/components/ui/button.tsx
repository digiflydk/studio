
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import type { ButtonVariantOption, ButtonSizeOption } from '@/types/settings';

const buttonVariants = cva(
  "btn inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn--primary",
        secondary: "btn--secondary",
        outline: "btn--outline",
        destructive: "btn--destructive",
      },
      size: {
        sm: "btn--sm",
        md: "btn--md",
        lg: "btn--lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  variant?: ButtonVariantOption;
  size?: ButtonSizeOption;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { buttonSettings } = useTheme();
    const Comp = asChild ? Slot : "button";

    const v = variant ?? buttonSettings?.defaultVariant ?? 'primary';
    const s = size ?? buttonSettings?.defaultSize ?? 'md';

    return (
      <Comp
        className={cn(buttonVariants({ variant: v, size: s, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
