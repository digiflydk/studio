
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";

export default function CmsHeaderPage() {
  return (
    <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
                 <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <ArrowUp className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4">Header indstillinger</CardTitle>
                <CardDescription>Dette område er under udvikling. Her vil du kunne administrere indholdet i din header.</CardDescription>
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
