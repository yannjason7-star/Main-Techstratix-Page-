"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Download, BarChart3, TrendingUp, DownloadCloud, Loader2, Users, Rocket } from "lucide-react";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState({
    startups: 0,
    mentors: 0,
    investors: 0,
    courses: 0,
    events: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // On compte les profils approuvés par rôle
      const { count: startupCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup').eq('status', 'approved');
      const { count: mentorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor').eq('status', 'approved');
      const { count: investorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor').eq('status', 'approved');
      
      // On compte les cours et événements
      const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

      setStats({
        startups: startupCount || 0,
        mentors: mentorCount || 0,
        investors: investorCount || 0,
        courses: courseCount || 0,
        events: eventCount || 0
      });
      
    } catch (error: any) {
      console.error("Erreur stats:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    // Simulation de génération d'un PDF complexe
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerating(false);
    alert("✅ Simulation : Le rapport PDF 'Impact_TechStratix_2026.pdf' a été généré et téléchargé avec les données en temps réel !");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Export & Data</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Rapports d'Impact</h2>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={generating || loading}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm disabled:opacity-50"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />} 
          {generating ? "GÉNÉRATION EN COURS..." : "GÉNÉRER UN RAPPORT (PDF)"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[#2563EB]"><Loader2 className="animate-spin" size={32} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#101D42] rounded-[24px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <Rocket size={24} className="mb-6 text-[#2563EB]" />
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Startups Accélérées</p>
              <h3 className="text-5xl font-serif">{stats.startups}</h3>
            </div>
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-[24px] p-8">
              <Users size={24} className="mb-6 text-[#101D42]" />
              <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Réseau d'Experts</p>
              <h3 className="text-5xl font-serif text-[#101D42]">{stats.mentors + stats.investors}</h3>
              <p className="text-xs text-gray-500 mt-2">{stats.mentors} Mentors • {stats.investors} Investisseurs</p>
            </div>
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-[24px] p-8">
              <FileText size={24} className="mb-6 text-[#101D42]" />
              <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Activité Plateforme</p>
              <h3 className="text-5xl font-serif text-[#101D42]">{stats.courses + stats.events}</h3>
              <p className="text-xs text-gray-500 mt-2">{stats.courses} Formations • {stats.events} Événements</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-medium text-[#101D42] mb-6">Archives des rapports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#101D42]">Rapport d'Impact Annuel 2026</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1">Statistiques complètes de la plateforme.</p>
                  </div>
                </div>
                <button onClick={handleGenerateReport} className="w-10 h-10 rounded-full bg-[#F8FAFC] text-[#101D42] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors border border-gray-200">
                  <DownloadCloud size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}