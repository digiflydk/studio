'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import { ArrowRight } from 'lucide-react';

export default function HeaderCTA(){
  const { settings: headerSettings } = useHeaderSettings();
  const s = headerSettings?.cta;

  if(!s?.enabled) return null;

  const content = (
    <Button data-testid="header-cta" variant={s.variant} size={s.size}>
        {s.label}
        {s.variant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
  
  if(s.linkType==='internal' && s.href?.startsWith('#')){
    const onClick = (e:React.MouseEvent)=>{ 
      e.preventDefault(); 
      const id=s.href.slice(1); 
      const el=document.getElementById(id); 
      const hh=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'))||0; 
      if(el){ 
        const y=el.getBoundingClientRect().top+window.scrollY-(hh+16); 
        window.scrollTo({top:y,behavior:'smooth'});
      } 
    };
    return <a href={s.href} onClick={onClick}>{content}</a>;
  }
  
  return <Link href={s.href ?? '#'}>{content}</Link>;
}
