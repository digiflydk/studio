'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileFloatingCTA(){
  const { settings: s } = useHeaderSettings();
  
  if(!(s?.enabled && s?.mobileFloating?.enabled)) return null;
  
  const pos = s.mobileFloating.position==='bl' ? { left: s.mobileFloating.offsetX ?? 16 } : { right: s.mobileFloating.offsetX ?? 16 };
  const style = { 
      position:'fixed' as const, 
      bottom: `calc(${(s.mobileFloating.offsetY ?? 16)}px + var(--cookie-footer-offset, 0px))`, 
      ...pos, 
      zIndex: 40 
  };
  
  const btn = (
    <Button data-testid="mobile-floating-cta" variant={s.variant} size={s.size}>
        {s.label}
        {s.variant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
  
  const isInternal = s.linkType==='internal' && s.href?.startsWith('#');
  
  const onClick = isInternal ? (e:React.MouseEvent)=>{ 
      e.preventDefault(); 
      const id=s.href.slice(1); 
      const el=document.getElementById(id); 
      const hh=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'))||0; 
      if(el){ 
          const y=el.getBoundingClientRect().top+window.scrollY-(hh+16); 
          window.scrollTo({top:y,behavior:'smooth'});
      } 
  } : undefined;

  return (
    <div className="md:hidden" style={style}>
      {isInternal ? <a href={s.href} onClick={onClick}>{btn}</a> : <Link href={s.href ?? '#'}>{btn}</Link>}
    </div>
  );
}
