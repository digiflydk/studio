"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { Home } from "lucide-react";

export default function CmsHeader() {
  const { resetTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <h1 className="text-xl font-bold">Design Indstillinger</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button onClick={resetTheme} variant="outline">
          Nulstil Indstillinger
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link href="/" aria-label="Gå til forside">
            <Home className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
