
"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { Brush, Settings, ChevronDown, Building, Search, Share2, MousePointerClick, Cookie, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { getGeneralSettings, GeneralSettings } from "@/services/settings";

const settingsNavLinks = [
    { href: "/cms/settings/general", label: "General", icon: Settings },
    { href: "/cms/settings/seo", label: "SEO", icon: Search },
    { href: "/cms/settings/social", label: "Social Share", icon: Share2 },
    { href: "/cms/settings/tracking", label: "Tracking", icon: MousePointerClick },
    { href: "#", label: "Cookies", icon: Cookie },
    { href: "#", label: "Business listing", icon: Building },
]

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith('/cms/settings'));
  const [isPagesOpen, setIsPagesOpen] = useState(pathname.startsWith('/cms/pages'));
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
      async function loadSettings() {
          const loadedSettings = await getGeneralSettings();
          setSettings(loadedSettings);
      }
      loadSettings();
  }, []);

  const pageLinks = [
    { href: "/cms/pages/home", label: "Home" },
    { href: "/cms/pages/header", label: "Header" },
    { href: "/cms/pages/footer", label: "Footer" },
  ];

  return (
    <aside className="hidden border-r bg-black text-white md:block">
      <div className="flex h-14 items-center border-b border-gray-800 px-4 lg:h-[60px] lg:px-6">
        <Link href="/cms" className="flex items-center gap-2 font-semibold">
          <Logo logoUrl={settings?.logoUrl} logoAlt={settings?.logoAlt} />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/cms"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname === '/cms' }
              )}
            >
              <Brush className="h-4 w-4" />
              Design
            </Link>
            <Collapsible open={isPagesOpen} onOpenChange={setIsPagesOpen}>
                <CollapsibleTrigger 
                    className={cn("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                        {"bg-gray-800 text-white": pathname.startsWith('/cms/pages')}
                    )}
                    asChild
                >
                   <Link href="/cms/pages">
                        <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4" />
                            <span>Pages</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", { "rotate-180": isPagesOpen })} />
                    </Link>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                    <ul className="grid items-start py-2 text-sm font-medium">
                       {pageLinks.map(link => (
                         <li key={link.label}>
                            <Link
                                href={link.href}
                                className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                                { "bg-gray-800 text-white": pathname === link.href }
                                )}
                            >
                                {link.label}
                            </Link>
                         </li>
                       ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
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
        </nav>
      </div>
    </aside>
  );
}
