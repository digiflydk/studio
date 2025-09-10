
"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { Brush, Settings, ChevronDown, Building, Search, Share2, MousePointerClick, Cookie, FileText, Sparkles, Users, HeartHandshake, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect, Suspense } from "react";
import { getGeneralSettings } from "@/services/settings";
import type { GeneralSettings } from "@/types/settings";

const settingsNavLinks = [
    { href: "/cms/settings/general", label: "General", icon: Settings },
    { href: "/cms/settings/ai", label: "AI Prompt", icon: Sparkles },
    { href: "/cms/settings/seo", label: "SEO", icon: Search },
    { href: "/cms/settings/social", label: "Social Share", icon: Share2 },
    { href: "/cms/settings/tracking", label: "Tracking", icon: MousePointerClick },
    { href: "/cms/settings/cookies", label: "Cookies", icon: Cookie },
]

function SidebarInner() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    setIsSettingsOpen(pathname.startsWith('/cms/settings'));
    async function loadSettings() {
        const loadedSettings = await getGeneralSettings();
        setSettings(loadedSettings);
    }
    loadSettings();
  }, [pathname]);
  
  return (
    <aside className="hidden border-r bg-black text-white md:block">
      <div className="flex h-14 items-center border-b border-gray-800 px-4 lg:h-[60px] lg:px-6">
        <Link href="/cms/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo logoUrl={settings?.logoUrl} logoAlt={settings?.logoAlt} />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/cms/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname === '/cms/dashboard' }
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/cms/pages"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname.startsWith('/cms/pages') }
              )}
            >
              <FileText className="h-4 w-4" />
              Content
            </Link>
            <Link
              href="/cms/design"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname.startsWith('/cms/design') }
              )}
            >
              <Brush className="h-4 w-4" />
              Design
            </Link>
             <Link
              href="/cms/leads"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname.startsWith('/cms/leads') }
              )}
            >
              <Users className="h-4 w-4" />
              Cust. Leads
            </Link>
            <Link
              href="/cms/customers"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                { "bg-gray-800 text-white": pathname.startsWith('/cms/customers') }
              )}
            >
              <HeartHandshake className="h-4 w-4" />
              Customers
            </Link>
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

export default function Sidebar() {
    return (
        <Suspense fallback={<div className="hidden w-[220px] bg-black md:block lg:w-[280px]"></div>}>
            <SidebarInner />
        </Suspense>
    )
}
