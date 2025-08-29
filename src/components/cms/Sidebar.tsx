"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { Brush, Settings, ChevronDown, Building, Search, Share2, MousePointerClick, Cookie } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const mainNavLinks = [
  { href: "/cms", label: "Design", icon: Brush },
];

const settingsNavLinks = [
    { href: "/cms/settings/general", label: "General", icon: Settings },
    { href: "#", label: "SEO", icon: Search },
    { href: "#", label: "Social Share", icon: Share2 },
    { href: "#", label: "Tracking", icon: MousePointerClick },
    { href: "#", label: "Cookies", icon: Cookie },
    { href: "#", label: "Business listing", icon: Building },
]

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith('/cms/settings'));

  return (
    <aside className="hidden w-64 flex-col border-r bg-black sm:flex text-white">
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <Link href="/cms">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid items-start px-4 text-sm font-medium">
          {mainNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                  { "bg-gray-800 text-white": pathname === link.href }
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          ))}
           <li>
            <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", { "rotate-180": isSettingsOpen })} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                    <ul className="grid items-start py-2 text-sm font-medium">
                       {settingsNavLinks.map(link => (
                         <li key={link.label}>
                            <Link
                                href={link.href}
                                className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                                { "bg-gray-800 text-white": pathname.startsWith(link.href) && link.href !== "#" }
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                         </li>
                       ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
