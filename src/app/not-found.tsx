import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center h-16 border-b">
        <div className="container mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Button asChild variant="secondary">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Siden blev ikke fundet</h2>
          <p className="mt-4 text-muted-foreground">
            Beklager, vi kunne ikke finde den side, du ledte efter. Måske er den flyttet, eller også har du tastet forkert.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/">Gå til forsiden</Link>
          </Button>
        </div>
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Digifly. Alle rettigheder forbeholdes.
      </footer>
    </div>
  );
}
