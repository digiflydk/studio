const HEX3 = /^#([0-9a-fA-F]{3})$/;
const HEX6 = /^#([0-9a-fA-F]{6})$/;

export function normalizeLinkColor(input?: string): { raw: string; canonical: "black" | "white" | "primary" | "secondary" | "hex"; } {
  const v = (input || "").trim().toLowerCase();

  if (v === "black" || v === "text-black") return { raw: "black", canonical: "black" };
  if (v === "white" || v === "text-white") return { raw: "white", canonical: "white" };
  if (v === "primary" || v === "brand") return { raw: "primary", canonical: "primary" };
  if (v === "secondary") return { raw: "secondary", canonical: "secondary" };
  if (HEX3.test(v) || HEX6.test(v)) return { raw: v, canonical: "hex" };
  return { raw: "white", canonical: "white" };
}

export function linkClassFromInput(input?: string): string {
  const { canonical, raw } = normalizeLinkColor(input);
  switch (canonical) {
    case "black":
      return "text-black hover:text-black/70";
    case "white":
      return "text-white hover:text-white/80";
    case "primary":
      return "text-primary hover:text-primary/80";
    case "secondary":
      return "text-secondary hover:text-secondary/80";
    case "hex":
      return `text-[${raw}] hover:opacity-80`;
    default:
      return "text-white hover:text-white/80";
  }
}
