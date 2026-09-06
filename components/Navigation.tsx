"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutGrid, Rocket, BookOpen, MessageSquare, Users, FileText, Settings, LogOut, 
  Briefcase, Star, Presentation, PieChart, Calendar, Layers 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("startup");

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (data && data.role) setUserRole(data.role);
      }
    };
    fetchRole();
  }, []);

  let menuItems: any[] = [];

  if (userRole === "startup") {
    menuItems = [
      { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutGrid },
      { name: "Mon Projet", href: "/projet", icon: Rocket },
      { name: "Formations", href: "/formations", icon: BookOpen },
      { name: "Messages", href: "/messages", icon: MessageSquare },
      { name: "Réseau", href: "/reseau", icon: Users },
      { name: "Documents", href: "/docs", icon: FileText },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ];
  } else if (userRole === "mentor") {
    menuItems = [
      { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutGrid },
      { name: "Mes Startups", href: "/mes-startups", icon: Briefcase },
      { name: "Messages", href: "/messages", icon: MessageSquare },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ];
  } else if (userRole === "investor") {
    menuItems = [
      { name: "Deal Flow", href: "/dashboard", icon: LayoutGrid },
      { name: "Favoris", href: "/favoris", icon: Star },
      { name: "Demo Day", href: "/demoday", icon: Presentation },
      { name: "Messages", href: "/messages", icon: MessageSquare },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ];
  } else if (userRole === "admin") {
    // LE NOUVEAU MENU ADMINISTRATEUR COMPLET
    menuItems = [
      { name: "Vue d'ensemble", href: "/admin", icon: PieChart },
      { name: "Utilisateurs & Match", href: "/admin/users", icon: Users },
      { name: "Cohortes", href: "/admin/cohortes", icon: Layers },
      { name: "Gestion LMS", href: "/admin/lms", icon: BookOpen },
      { name: "Événements", href: "/admin/events", icon: Calendar },
      { name: "Rapports", href: "/admin/reports", icon: FileText },
      { name: "Paramètres", href: "/settings", icon: Settings },
    ];
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-[260px] bg-[#F8FAFC] border-r border-gray-200 fixed h-full py-8 flex flex-col justify-between z-40">
      <div>
        <div className="flex items-center gap-3 px-8 mb-10">
          <div className="w-7 h-7 bg-[#101D42] rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-serif font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-medium text-[#101D42] tracking-tight">TechStratix</span>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-[14px] font-medium ${
                  isActive 
                    ? "bg-[#E2E8F0] text-[#101D42] shadow-sm" 
                    : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-[#F1F5F9]"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-[14px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}