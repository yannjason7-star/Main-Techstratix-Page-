"use client";

import { PieChart, TrendingUp, Users, BookOpen, Activity } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Tour de Contrôle</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Performances de l'Incubateur</h2>
      </div>

      {/* 4 CARTES KPI (Key Performance Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Taux d'Activité", value: "87%", trend: "+5% ce mois", icon: Activity, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { title: "Startups Actives", value: "142", trend: "+12 depuis janvier", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Matchs Réalisés", value: "89", trend: "Startups accompagnées", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Formations Suivies", value: "1.2k", trend: "Heures de visionnage", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-50" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm hover:border-[#2563EB]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={24} />
              </div>
            </div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">{kpi.title}</p>
            <h3 className="text-3xl font-medium text-[#101D42]">{kpi.value}</h3>
            <p className="text-xs font-medium text-[#9CA3AF] mt-2">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPHIQUE D'ENGAGEMENT (Style Barres) */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium text-[#101D42]">Engagement Global (Mensuel)</h3>
            <select className="bg-[#F8FAFC] border border-gray-200 text-xs font-bold text-[#101D42] py-2 px-4 rounded-full outline-none">
              <option>Cette année</option>
              <option>Annéee précédente</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65, 95, 70].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-[#E2E8F0] group-hover:bg-[#2563EB] rounded-t-md transition-colors relative" style={{ height: `${height}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#101D42] text-white text-[10px] py-1 px-2 rounded font-medium transition-opacity">
                    {height}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#9CA3AF]">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LISTE: DERNIERS ÉVÉNEMENTS CLÉS */}
        <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-medium text-[#101D42] mb-6">Événements Récents</h3>
          <div className="flex-1 space-y-6">
            {[
              { title: "Nouveau Match validé", desc: "GreenTech associé à Sarah Diop", time: "Il y a 2h" },
              { title: "Formation complétée", desc: "Fintech Africa a terminé 'Business Plan'", time: "Il y a 4h" },
              { title: "Nouveau Dossier", desc: "EduTech CI a soumis sa candidature", time: "Hier" },
              { title: "Paiement reçu", desc: "Nouvelle souscription Premium", time: "Hier" },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 items-start relative">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0"></div>
                {i !== 3 && <div className="absolute left-1 top-4 bottom-[-16px] w-[1px] bg-gray-100"></div>}
                <div>
                  <h4 className="text-sm font-medium text-[#101D42]">{event.title}</h4>
                  <p className="text-xs text-[#9CA3AF] my-0.5">{event.desc}</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}