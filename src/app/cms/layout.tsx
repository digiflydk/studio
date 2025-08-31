
import CmsHeader from "@/components/cms/CmsHeader";
import Sidebar from "@/components/cms/Sidebar";
import { getGeneralSettings } from "@/services/settings";
import { ThemeProvider } from "@/context/ThemeContext";

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGeneralSettings();
  return (
    <ThemeProvider settings={settings}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <CmsHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
