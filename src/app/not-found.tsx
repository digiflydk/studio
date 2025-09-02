'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function NotFoundContent() {
  // useSearchParams() kan nu sikkert kaldes her, hvis det er nødvendigt i fremtiden.
  // const searchParams = useSearchParams();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
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
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
