'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CmsHeader from '@/components/cms/CmsHeader';

const navItems = [
  { href: '/cms/dashboard', label: 'Dashboard' },
  { href: '/cms/pages', label: 'Content' },
  { href: '/cms/design', label: 'Design' },
  { href: '/cms/leads', label: 'Cust. Leads' },
  { href: '/cms/customers', label: 'Customers' },
  { href: '/cms/settings', label: 'Settings' },
];

function SidebarNav() {
    const pathname = usePathname();
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(item => (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                        { "bg-gray-800 text-white": pathname.startsWith(item.href) }
                    )}
                    >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}


export default function CmsLayout({ children }: { children: ReactNode }) {

  return (
    <ThemeProvider settings={null}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-black text-white md:block">
            <div className="flex h-14 items-center border-b border-gray-800 px-4 lg:h-[60px] lg:px-6">
                <Link href="/cms/dashboard" className="flex items-center gap-2 font-semibold">
                    <span>Digifly CMS</span>
                </Link>
            </div>
            <div className="flex-1 py-4">
               <SidebarNav />
            </div>
        </aside>
        <div className="flex flex-col bg-white">
            <CmsHeader settings={null} navItems={navItems} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
