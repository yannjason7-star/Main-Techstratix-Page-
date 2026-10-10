"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Rocket, Briefcase, TrendingUp, Users, Calendar, ArrowRight, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // États pour stocker les vraies données
  const [startupStats, setStartupStats] = useState({ progress: 0, completedTasks: 0, totalTasks: 0 });
  const [networkStats, setNetworkStats] = useState({ activeStartups: 0, totalEvents: 0 });
  const [dealFlow, setDealFlow] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Quel est mon rôle ?
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (!profile) return;
        setRole(profile.role);

        // 2. Récupérer les données selon le rôle
        if (profile.role === 'startup') {
          // Calcul de la VRAIE progression basée sur les tâches
          const { data: tasks } = await supabase.from('tasks').select('status').eq('user_id', user.id);
          if (tasks && tasks.length > 0) {
            const completed = tasks.filter(t => t.status === 'done').length;
            const progressPercent = Math.round((completed / tasks.length) * 100);
            setStartupStats({ progress: progressPercent, completedTasks: completed, totalTasks: tasks.length });
          }
        } 
        else if (profile.role === 'mentor') {
          // Compter les vraies startups actives
          const { count: startupCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup').eq('status', 'approved');
          const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
          setNetworkStats({ activeStartups: startupCount || 0, totalEvents: eventCount || 0 });
        }
        else if (profile.role === 'investor') {
          // Afficher les 3 dernières startups du Deal Flow
          const { data: startups } = await supabase
            .from('profiles')
            .select('id, full_name, startup_profiles(sector, startup_name)')
            .eq('role', 'startup')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .limit(3);
          
          if (startups) setDealFlow(startups);
        }

      } catch (error) {
        console.error("Erreur Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="h-[50vh] flex items-center justify-center text-[#2563EB]"><Loader2 className="animate-spin" size={40} /></div>;
  }

  // ==========================================
  // VUE : STARTUP
  // ==========================================
  if (role === "startup") {
    return (
      <div className="max-w-5xl mx-auto pb-12">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Vue d'ensemble</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Ma Progression</h2>
        </div>
        
        <div className="bg-white rounded-[32px] border border-gray-200 p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB] opacity-5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center shadow-inner">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#101D42]">Bienvenue dans votre espace d'accélération.</h3>
              <p className="text-[#9CA3AF] text-sm">Utilisez le menu pour suivre vos objectifs et contacter vos mentors.</p>
            </div>
          </div>

          <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100 relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div className="flex items-center gap-2 text-[#101D42] font-medium text-sm">
                <Target size={18} className="text-[#2563EB]" /> Feuille de route
              </div>
              <p className="text-2xl font-bold text-[#101D42]">{startupStats.progress}%</p>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#2563EB] transition-all duration-1000" style={{ width: `${startupStats.progress}%` }}></div>
            </div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              {startupStats.completedTasks} tâches terminées sur {startupStats.totalTasks}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE : MENTOR
  // ==========================================
  if (role === "mentor") {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-600 uppercase mb-2">Espace Expert</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Bienvenue, Mentor.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#101D42] text-white p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#2563EB] opacity-20 blur-[40px] group-hover:opacity-40 transition-opacity"></div>
            <Briefcase size={28} className="mb-6 text-[#2563EB]" />
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Startups dans l'incubateur</p>
            <h3 className="text-5xl font-serif">{networkStats.activeStartups}</h3>
          </div>
          
          <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm hover:border-emerald-500/30 transition-colors">
            <Calendar size={28} className="mb-6 text-emerald-500" />
            <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Événements programmés</p>
            <h3 className="text-5xl font-serif text-[#101D42]">{networkStats.totalEvents}</h3>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE : INVESTISSEUR
  // ==========================================
  if (role === "investor") {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-orange-600 uppercase mb-2">Sourcing & Opportunités</p>
            <h2 className="text-2xl font-medium text-[#101D42]">Deal Flow Récent</h2>
          </div>
          <Link href="/reseau" className="text-[10px] font-bold text-[#2563EB] uppercase hover:underline">Voir tout l'annuaire</Link>
        </div>

        {dealFlow.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] border border-gray-200 text-center shadow-sm">
            <TrendingUp size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-[#9CA3AF] font-medium">Aucune nouvelle startup n'a été approuvée récemment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dealFlow.map((startup, i) => {
              const details = startup.startup_profiles?.[0] || {};
              const sName = details.startup_name || startup.full_name;
              const sSector = details.sector || "Non spécifié";
              
              return (
                <div key={i} className="bg-white rounded-[24px] border border-gray-200 p-6 shadow-sm hover:border-[#2563EB]/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-xl font-serif text-[#101D42] mb-4">
                      {sName.charAt(0)}
                    </div>
                    <h4 className="text-lg font-medium text-[#101D42] mb-1 truncate">{sName}</h4>
                    <span className="text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase bg-gray-50 px-2 py-1 rounded">
                      {sSector}
                    </span>
                  </div>
                  <Link href="/reseau" className="mt-6 w-full flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#2563EB] py-3 rounded-full text-xs font-bold transition-colors">
                    VOIR LE PROFIL <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}