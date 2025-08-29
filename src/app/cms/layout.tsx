import CmsHeader from "@/components/cms/CmsHeader";
import Sidebar from "@/components/cms/Sidebar";

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <CmsHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
