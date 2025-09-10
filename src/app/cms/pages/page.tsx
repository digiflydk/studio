
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, ArrowUp, ArrowDown, PanelTop, PanelBottom, RadioTower } from "lucide-react";
import Link from "next/link";

const pageSections = [
  {
    name: "Home",
    description: "Manage the content on the home page.",
    href: "/cms/pages/home",
    icon: Home,
  },
   {
    name: "Header",
    description: "Edit the site header, navigation and CTA button.",
    href: "/cms/pages/header",
    icon: PanelTop,
  },
   {
    name: "Footer",
    description: "Edit the site footer and contact information.",
    href: "/cms/pages/footer",
    icon: PanelBottom,
  },
];

export default function CmsPagesPage() {
  return (
    <div className="space-y-8">
       <div>
            <h1 className="text-2xl font-bold">Page Content</h1>
            <p className="text-muted-foreground">Select a section to edit its content.</p>
       </div>
        <Card className="shadow-lg">
            <CardContent className="p-0">
                <ul className="divide-y">
                    {pageSections.map((section, index) => (
                         <li key={section.name} className="p-4 hover:bg-muted/50 transition-colors">
                            <Link href={section.href} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="bg-muted rounded-md p-2">
                                        <section.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{section.name}</h3>
                                        <p className="text-sm text-muted-foreground">{section.description}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                         </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
