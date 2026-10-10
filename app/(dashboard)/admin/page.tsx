"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PieChart, TrendingUp, Users, BookOpen, Activity, Clock, ShieldCheck, Loader2, Rocket } from "lucide-react";
type RecentEvent = {
  id: string;
  title: string;
  desc: string;
  time: string;
  dateObj: Date;
  type: 'signup' | 'review';
};

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  
  // États pour les Vraies Données
  const [stats, setStats] = useState({
    pending: 0,
    activeStartups: 0,
    activeNetwork: 0, // Mentors + Investisseurs
    totalCourses: 0
  });
  
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Récupération de tous les profils pour les KPIs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, role, status, full_name, created_at")
        .neq("role", "admin");

      if (profilesError) throw profilesError;

      // 2. Récupération des cours
      const { count: courseCount } = await supabase
        .from("courses")
        .select("*", { count: 'exact', head: true });

      // 3. Récupération des derniers logs de modération
      const { data: logs } = await supabase
        .from("review_logs")
        .select("*, profiles!review_logs_profile_id_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (profiles) {
        // Calcul des vrais KPIs
        setStats({
          pending: profiles.filter(p => p.status === 'pending').length,
          activeStartups: profiles.filter(p => p.role === 'startup' && p.status === 'approved').length,
          activeNetwork: profiles.filter(p => (p.role === 'mentor' || p.role === 'investor') && p.status === 'approved').length,
          totalCourses: courseCount || 0
        });

        // Construction de la Timeline (Événements Récents)
        let events: RecentEvent[] = [];

        // Ajouter les nouvelles inscriptions
        const recentSignups = profiles
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(p => ({
            id: `signup_${p.id}`,
            title: "Nouveau Dossier",
            desc: `${p.full_name} s'est inscrit en tant que ${p.role}.`,
            time: new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            dateObj: new Date(p.created_at),
            type: 'signup' as const
          }));
        
        events = [...events, ...recentSignups];

        // Ajouter les actions de modération
        if (logs) {
          const recentReviews = logs.map(l => {
            const profileName = l.profiles?.full_name || "Un candidat";
            let actionStr = "";
            if (l.new_status === 'approved') actionStr = "a été approuvé(e)";
            else if (l.new_status === 'rejected') actionStr = "a été refusé(e)";
            else if (l.new_status === 'under_review') actionStr = "est en cours d'examen";
            else actionStr = `est passé(e) en ${l.new_status}`;

            return {
              id: `log_${l.id}`,
              title: "Décision d'Administration",
              desc: `Le dossier de ${profileName} ${actionStr}.`,
              time: new Date(l.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              dateObj: new Date(l.created_at),
              type: 'review' as const
            };
          });
          events = [...events, ...recentReviews];
        }

        // Trier par date la plus récente et garder les 5 premiers
        events.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
        setRecentEvents(events.slice(0, 5));
      }

    } catch (error: any) {
      console.error("Erreur Dashboard:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full pt-20"><Loader2 className="animate-spin text-[#2563EB]" size={40} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Tour de Contrôle</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Performances de l'Incubateur</h2>
      </div>

      {/* 4 CARTES KPI (Connectées à Supabase) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:border-[#2563EB]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50 text-orange-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Dossiers en attente</p>
          <h3 className="text-3xl font-medium text-[#101D42]">{stats.pending}</h3>
          <p className="text-xs font-medium text-orange-600 mt-2">À traiter</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:border-[#2563EB]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <Rocket size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Startups Accélérées</p>
          <h3 className="text-3xl font-medium text-[#101D42]">{stats.activeStartups}</h3>
          <p className="text-xs font-medium text-emerald-600 mt-2">Profils approuvés</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:border-[#2563EB]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Réseau d'Experts</p>
          <h3 className="text-3xl font-medium text-[#101D42]">{stats.activeNetwork}</h3>
          <p className="text-xs font-medium text-[#9CA3AF] mt-2">Mentors & Investisseurs</p>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:border-[#2563EB]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-[#2563EB]">
              <BookOpen size={24} />
            </div>
          </div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Formations LMS</p>
          <h3 className="text-3xl font-medium text-[#101D42]">{stats.totalCourses}</h3>
          <p className="text-xs font-medium text-[#9CA3AF] mt-2">Cours publiés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPHIQUE VISUEL D'ENGAGEMENT (Données visuelles pour la démo) */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium text-[#101D42]">Trafic & Engagement (30 derniers jours)</h3>
            <span className="bg-[#F8FAFC] border border-gray-200 text-xs font-bold text-[#101D42] py-2 px-4 rounded-full">
              Vue Globale
            </span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65, 95, 70].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-[#E2E8F0] group-hover:bg-[#2563EB] rounded-t-md transition-colors relative" style={{ height: `${height}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#101D42] text-white text-[10px] py-1 px-2 rounded font-medium transition-opacity">
                    {height}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#9CA3AF]">J-{12-i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE : ÉVÉNEMENTS RÉCENTS (Connectée à Supabase) */}
        <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-medium text-[#101D42] mb-6">Événements Récents</h3>
          <div className="flex-1 space-y-6">
            
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune activité récente.</p>
            ) : (
              recentEvents.map((event, i) => (
                <div key={event.id} className="flex gap-4 items-start relative">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 z-10 ${event.type === 'signup' ? 'bg-[#2563EB]' : 'bg-emerald-500'}`}></div>
                  
                  {/* Le trait vertical pour relier la timeline (sauf pour le dernier élément) */}
                  {i !== recentEvents.length - 1 && (
                    <div className="absolute left-1 top-4 bottom-[-16px] w-[1px] bg-gray-200 z-0"></div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-[#101D42]">{event.title}</h4>
                    <p className="text-xs text-[#9CA3AF] my-0.5 leading-relaxed">{event.desc}</p>
                    <span className="text-[10px] font-bold text-gray-400">{event.time}</span>
                  </div>
                </div>
              ))
            )}
            
          </div>
        </div>
      </div>

    </div>
  );
}