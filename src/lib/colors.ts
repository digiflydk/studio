const HEX3 = /^#([0-9a-fA-F]{3})$/;
const HEX6 = /^#([0-9a-fA-F]{6})$/;

export function normalizeLinkColor(input?: string): { canonical: "black" | "white" | "primary" | "secondary" | "hex"; raw: string } {
  const v = (input || "").trim().toLowerCase();
  if (v === "black" || v === "text-black" || v === "sort") return { canonical: "black", raw: "black" };
  if (v === "white" || v === "text-white" || v === "hvid") return { canonical: "white", raw: "white" };
  if (v === "primary" || v === "brand") return { canonical: "primary", raw: "primary" };
  if (v === "secondary") return { canonical: "secondary", raw: "secondary" };
  if (HEX3.test(v) || HEX6.test(v)) return { canonical: "hex", raw: v };
  return { canonical: "white", raw: "white" };
}

export function linkClassFromInput(input?: string, hex?: string): string {
  const { canonical, raw } = normalizeLinkColor(input);
  if (canonical === "hex" || hex) return `text-[${hex || raw}] hover:opacity-80`;
  switch (canonical) {
    case "black":
      return "text-black hover:text-black/70";
    case "white":
      return "text-white hover:text-white/80";
    case "primary":
      return "text-primary hover:text-primary/80";
    case "secondary":
      return "text-secondary hover:text-secondary/80";
    default:
      return "text-white hover:text-white/80";
  }
}
