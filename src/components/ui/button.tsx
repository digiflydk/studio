"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--btn-shape,0.5rem)] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn--default",
        primary: "btn--primary",
        secondary: "btn--secondary",
        outline: "btn--outline",
        destructive: "btn--destructive",
        ghost: "btn--ghost",
        link: "btn--link",
        pill: "btn--pill",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  textSize?: "xs" | "sm" | "md" | "lg";
  active?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, textSize, active, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const ts =
      textSize === "xs" ? "text-xs" :
      textSize === "sm" ? "text-sm" :
      textSize === "lg" ? "text-lg" : "text-base";
    const activeCls = active ? "aria-[current=true]:ring-2" : "";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), ts, activeCls, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
