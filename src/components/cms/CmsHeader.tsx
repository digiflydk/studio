"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, PanelLeft, Brush, FileText, Settings, ChevronDown, Search, Share2, MousePointerClick, Cookie, Building, Sparkles, Users, HeartHandshake, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import Logo from "../logo";
import type { GeneralSettings } from "@/types/settings";
import { usePathname } from "next/navigation";


const settingsNavLinks = [
    { href: "/cms/settings/general", label: "General", icon: Settings },
    { href: "/cms/settings/ai", label: "AI Prompt", icon: Sparkles },
    { href: "/cms/settings/seo", label: "SEO", icon: Search },
    { href: "/cms/settings/social", label: "Social Share", icon: Share2 },
    { href: "/cms/settings/tracking", label: "Tracking", icon: MousePointerClick },
    { href: "/cms/settings/cookies", label: "Cookies", icon: Cookie },
]

const pageTitles: Record<string, string> = {
    '/cms/dashboard': 'Dashboard',
    '/cms/pages': 'Page Content',
    '/cms/pages/home': 'Home Page Settings',
    '/cms/pages/header': 'Header Settings',
    '/cms/pages/footer': 'Footer Settings',
    '/cms/design': 'Design Settings',
    '/cms/leads': 'Customer Leads',
    '/cms/customers': 'Customers',
    '/cms/settings': 'Settings',
    '/cms/settings/general': 'General Settings',
    '/cms/settings/ai': 'AI Prompt Settings',
    '/cms/settings/seo': 'SEO Settings',
    '/cms/settings/social': 'Social Share Settings',
    '/cms/settings/tracking': 'Tracking Settings',
    '/cms/settings/cookies': 'Cookie Settings',
};

export default function CmsHeader({ settings }: { settings: GeneralSettings | null }) {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith('/cms/settings');
  const title = pageTitles[pathname] || 'CMS';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-black text-white border-gray-800">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle asChild>
                         <Link href="/cms/dashboard" className="flex items-center gap-2 font-semibold">
                            <Logo logoUrl={settings?.logoUrl} logoAlt={settings?.logoAlt} />
                        </Link>
                    </SheetTitle>
                    <SheetDescription>
                        Manage your website's settings and content.
                    </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 text-base font-medium">
                     <Link href="/cms/dashboard" className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname === '/cms/dashboard' })}>
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/cms/pages" className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname.startsWith('/cms/pages') })}>
                        <FileText className="h-5 w-5" />
                        Content
                    </Link>
                    <Link href="/cms/design" className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname.startsWith('/cms/design') })}>
                        <Brush className="h-5 w-5" />
                        Design
                    </Link>
                    <Link href="/cms/leads" className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname.startsWith('/cms/leads') })}>
                        <Users className="h-5 w-5" />
                        Cust. Leads
                    </Link>
                    <Link href="/cms/customers" className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname.startsWith('/cms/customers') })}>
                        <HeartHandshake className="h-5 w-5" />
                        Customers
                    </Link>
                    <Collapsible open={isSettingsPage}>
                        <CollapsibleTrigger asChild>
                            <Link href="/cms/settings" className="flex w-full items-center justify-between gap-4 px-2.5 text-gray-400 transition-all hover:text-white">
                                <div className="flex items-center gap-4">
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                </div>
                                <ChevronDown className={cn("h-5 w-5 transition-transform", { "rotate-180": isSettingsPage })} />
                            </Link>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-10">
                            <ul className="grid items-start py-2 text-sm font-medium">
                               {settingsNavLinks.map(link => (
                                 <li key={link.label}>
                                    <Link href={link.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white", { "bg-gray-800 text-white": pathname.startsWith(link.href) && link.href !== "#" })}>
                                        <link.icon className="h-4 w-4" />
                                        {link.label}
                                    </Link>
                                 </li>
                               ))}
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>
                </nav>
            </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="icon">
                <Link href="/" aria-label="Go to homepage">
                    <Home className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    </header>
  );
}
