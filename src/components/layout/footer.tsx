import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">Flow. Automatisér. Skalér.</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm hover:text-primary transition-colors">CVR: 12345678</Link>
              <Link href="mailto:hello@digifly.dk" className="text-sm hover:text-primary transition-colors">hello@digifly.dk</Link>
            </div>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Digifly. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
