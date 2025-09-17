"use client";

import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-neutral-200 w-10 h-10 hover:bg-neutral-100 active:scale-[0.98] transition",
        className
      )}
    />
  );
}
