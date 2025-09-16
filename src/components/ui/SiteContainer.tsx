import React from "react";
import { cn } from "@/lib/utils";

/**
 * Fælles site-container så header, hero m.fl. flugter 1:1.
 * Justér KUN disse tre tal hvis hele sitet ændrer standard:
 * - max width
 * - padding på små/mellem/store skærme
 */
const BASE =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"; // <— samme i header og hero

type Props = React.PropsWithChildren<{ className?: string }>;

export default function SiteContainer({ className, children }: Props) {
  return <div className={cn(BASE, className)}>{children}</div>;
}
