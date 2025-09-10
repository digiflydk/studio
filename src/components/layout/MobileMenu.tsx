
'use client';

import Link from 'next/link';
import HeaderCTA from '@/components/common/HeaderCTA';
import type { NavLink } from '@/types/settings';

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  if (!open) return null;
  return (
    <div className="md:hidden border-t border-black/10 bg-white px-4 pb-4 pt-3">
      <nav className="flex flex-col gap-3" aria-label="Mobilnavigation">
        {links?.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="py-1 text-[16px] text-black/90"
            onClick={onClose}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-3">
        <HeaderCTA />
      </div>
    </div>
  );
}
