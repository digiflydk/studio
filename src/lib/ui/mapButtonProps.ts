
export function mapVariant(v?: string): "default" | "pill" | "destructive" | "outline" | "secondary" | "ghost" | "link" {
  switch (v) {
    case "pill": return "pill";
    case "outline": return "outline";
    case "secondary": return "secondary";
    case "ghost": return "ghost";
    case "link": return "link";
    case "destructive": return "destructive";
    // "primary" eller ukendt fallback til "default"
    default: return "default";
  }
}
export function mapSize(s?: string): "default" | "sm" | "lg" | "icon" {
  switch (s) {
    case "sm": return "sm";
    case "lg": return "lg";
    case "icon": return "icon";
    // "md" eller ukendt -> "default"
    default: return "default";
  }
}
