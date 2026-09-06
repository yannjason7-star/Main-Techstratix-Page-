"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Rocket, Briefcase, TrendingUp, Users, Calendar, ArrowRight, Star } from "lucide-react";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (data) setRole(data.role);
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center text-[#2563EB]"><Loader2 className="animate-spin" size={40} /></div>;
  }

  // ==========================================
  // DASHBOARD STARTUP (Celui qu'on avait déjà)
  // ==========================================
  if (role === "startup") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Vue d'ensemble</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Ma Progression</h2>
        </div>
        <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-medium text-[#101D42] mb-4">Bienvenue dans votre espace d'accélération.</h3>
          <p className="text-[#9CA3AF] text-sm mb-6">Utilisez le menu de gauche pour suivre vos objectifs, accéder à vos formations et contacter vos mentors.</p>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] w-[67%]"></div>
          </div>
          <p className="text-right text-xs font-bold text-[#101D42] mt-2">67% complété</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD MENTOR (Nouveau !)
  // ==========================================
  if (role === "mentor") {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Espace Expert</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Bienvenue, Mentor.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#101D42] text-white p-6 rounded-[24px] shadow-sm">
            <Briefcase size={24} className="mb-4 text-[#2563EB]" />
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Startups accompagnées</p>
            <h3 className="text-4xl font-serif">3</h3>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-[24px] shadow-sm">
            <Calendar size={24} className="mb-4 text-[#101D42]" />
            <p className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase mb-1">Sessions ce mois</p>
            <h3 className="text-4xl font-serif text-[#101D42]">8</h3>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-[24px] shadow-sm">
            <Users size={24} className="mb-4 text-[#101D42]" />
            <p className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase mb-1">Demandes en attente</p>
            <h3 className="text-4xl font-serif text-[#101D42]">1</h3>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD INVESTISSEUR (Nouveau Deal Flow)
  // ==========================================
  if (role === "investor") {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Sourcing & Opportunités</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Deal Flow (Startups du moment)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { name: "AgroTech CI", sector: "AgriTech", ask: "150k€", traction: "CA: 12k€/MRR", logo: "A" },
            { name: "PayFlow", sector: "FinTech", ask: "500k€", traction: "10k Utilisateurs", logo: "P" },
            { name: "Solaris", sector: "CleanTech", ask: "200k€", traction: "Prototypes validés", logo: "S" },
          ].map((startup, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-gray-200 p-6 flex items-center justify-between shadow-sm hover:border-[#2563EB]/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-xl font-serif text-[#101D42]">{startup.logo}</div>
                <div>
                  <h4 className="text-lg font-medium text-[#101D42]">{startup.name}</h4>
                  <div className="flex gap-2 text-xs font-bold text-[#9CA3AF] mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{startup.sector}</span>
                    <span className="bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded">Recherche: {startup.ask}</span>
                  </div>
                </div>
              </div>
              <button className="text-[#2563EB] bg-[#EFF6FF] p-3 rounded-full hover:bg-blue-100 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}