/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, PanelLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { GeneralSettings } from "@/types/settings";
import { usePathname } from "next/navigation";
import Logo from "../logo";


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

interface CmsHeaderProps {
    settings: GeneralSettings | null;
    navItems: { href: string, label: string }[];
}

export default function CmsHeader({ settings, navItems }: CmsHeaderProps) {
  const pathname = usePathname();
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
                     {navItems.map(item => (
                         <Link
                            key={item.href}
                            href={item.href}
                            className={cn("flex items-center gap-4 px-2.5 text-gray-400 hover:text-white", { "text-white": pathname.startsWith(item.href) })}
                            >
                            {item.label}
                        </Link>
                    ))}
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
