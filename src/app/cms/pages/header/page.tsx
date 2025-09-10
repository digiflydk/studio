import HeaderSettingsForm from './HeaderSettingsForm';
import { getHeaderSettings } from '@/lib/cms/pages-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function HeaderPage(){
  const initial = await getHeaderSettings();
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Header CTA</h1>
            <p className="text-muted-foreground">Administrer Call-to-Action knappen i din header.</p>
        </div>
      <Card>
        <CardHeader>
            <CardTitle>Indstillinger for CTA</CardTitle>
            <CardDescription>Styr synlighed, udseende og link for din primære CTA-knap.</CardDescription>
        </CardHeader>
        <CardContent>
            <HeaderSettingsForm initial={initial} />
        </CardContent>
      </Card>
    </div>
  );
}
