
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function CmsPagesPage() {
  return (
    <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
                 <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4">Sideadministration</CardTitle>
                <CardDescription>Dette område er under udvikling. Her vil du kunne administrere indholdet på dine sider.</CardDescription>
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
