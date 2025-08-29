
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";

export default function CmsFooterPage() {
  return (
    <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
                 <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <ArrowDown className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4">Footer indstillinger</CardTitle>
                <CardDescription>Dette område er under udvikling. Her vil du kunne administrere indholdet i din footer.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Kom snart tilbage for at se de nye funktioner!
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
