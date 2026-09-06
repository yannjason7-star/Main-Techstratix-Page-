import Navigation from "@/components/Navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex text-[#101D42]">
      {/* La Sidebar fixe (qui gère déjà le PC et le Mobile) */}
      <Navigation />
      
      {/* Le conteneur principal qui affichera les pages */}
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen bg-[#FAFAFA]">
        {children}
      </div>
    </div>
  );
}