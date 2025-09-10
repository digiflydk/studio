'use client';
import { useState } from 'react';
import type { HeaderCTASettings } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'pill'] as const;
const sizes = ['default', 'sm', 'lg', 'icon'] as const;

export default function HeaderSettingsForm({ initial }:{ initial: HeaderCTASettings }){
  const [s, setS] = useState<HeaderCTASettings>(initial);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();
  
  const patch = (p: Partial<HeaderCTASettings>) => setS(prev => ({ ...prev, ...p }));
  const patchMobile = (p: Partial<HeaderCTASettings['mobileFloating']>) => {
    setS(prev => ({ ...prev, mobileFloating: { ...prev.mobileFloating, ...p } }));
  }

  async function onSave(){
    startSaving(async () => {
        try {
            const res = await fetch('/api/pages/header/save', {
                method:'POST', headers:{'content-type':'application/json'},
                body: JSON.stringify(s), cache:'no-store'
            });
            const json = await res.json();
            if(!json?.ok) throw new Error(json.message || 'Gem fejlede');
            
            setS(json.data);
            window.dispatchEvent(new CustomEvent('pages:header:updated', { detail: json.data }));
            
            toast({
                title: 'Gemt!',
                description: 'Dine header-indstillinger er blevet gemt.',
            });

        } catch (error: any) {
             toast({
                title: 'Fejl!',
                description: error.message,
                variant: 'destructive'
            });
        }
    });
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="cta-enabled" className="text-base">Aktivér header-CTA</Label>
                 <p className="text-sm text-muted-foreground">Viser en Call-to-Action knap i headeren.</p>
            </div>
            <Switch
                id="cta-enabled"
                checked={s.enabled}
                onCheckedChange={checked => patch({ enabled: checked })}
            />
        </div>

      {s.enabled && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Label</Label>
                <Input value={s.label} onChange={e=>patch({label:e.target.value})}/>
                </div>

                <div className="space-y-2">
                <Label>Linktype</Label>
                <Select value={s.linkType} onValueChange={(v: 'internal' | 'external') => patch({linkType: v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="internal">Intern (#sektion)</SelectItem>
                        <SelectItem value="external">Ekstern (URL)</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                <Label>Href</Label>
                <Input placeholder={s.linkType==='internal'?'#sektion-id':'https://domæne.dk'}
                        value={s.href} onChange={e=>patch({href:e.target.value})}/>
                </div>

                <div className="space-y-2">
                <Label>Variant</Label>
                <Select value={s.variant} onValueChange={(v: any) => patch({variant: v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        {variants.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label>Størrelse</Label>
                <Select value={s.size} onValueChange={(v: any) => patch({size: v})}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                         {sizes.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
            </div>

            <fieldset className="border rounded-lg p-4 space-y-4">
                <legend className="px-1 text-sm font-medium -ml-1">Mobil: Floating CTA</legend>
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="mobile-cta-enabled" className="text-base">Aktivér mobil floating</Label>
                        <p className="text-sm text-muted-foreground">Viser en fast knap i bunden på mobilskærme.</p>
                    </div>
                     <Switch
                        id="mobile-cta-enabled"
                        checked={s.mobileFloating.enabled}
                        onCheckedChange={checked => patchMobile({ enabled: checked })}
                    />
                </div>

                {s.mobileFloating.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                    <Label>Position</Label>
                     <Select value={s.mobileFloating.position} onValueChange={(v: any) => patchMobile({ position: v })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="br">Nederst højre</SelectItem>
                            <SelectItem value="bl">Nederst venstre</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Offset X (px)</Label>
                        <Input type="number" min={0} value={s.mobileFloating.offsetX ?? 16}
                                onChange={e=>patchMobile({ offsetX: Number(e.target.value) })}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Offset Y (px)</Label>
                        <Input type="number" min={0} value={s.mobileFloating.offsetY ?? 16}
                                onChange={e=>patchMobile({ offsetY: Number(e.target.value) })}/>
                    </div>
                </div>
                )}
            </fieldset>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gem
        </Button>
      </div>
    </div>
  );
}
