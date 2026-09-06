"use client";

import { Briefcase, Calendar, MessageCircle, FileText } from "lucide-react";

export default function MesStartupsPage() {
  const MOCK_STARTUPS = [
    { name: "GreenTech Solutions", founders: "Alexandre", progress: 85, nextMeeting: "Demain, 14:00" },
    { name: "FinFlow Africa", founders: "Fatoumata", progress: 40, nextMeeting: "12 Octobre" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Suivi d'accompagnement</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Mes Startups</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_STARTUPS.map((startup, i) => (
          <div key={i} className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-medium text-[#101D42]">{startup.name}</h3>
                <p className="text-sm text-[#9CA3AF]">Par {startup.founders}</p>
              </div>
              <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-2xl flex items-center justify-center">
                <Briefcase size={20} />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-[#9CA3AF] mb-2">
                <span>Progression KYC & Formations</span>
                <span className="text-[#101D42]">{startup.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full">
                <div className="h-full bg-[#101D42] rounded-full" style={{ width: `${startup.progress}%` }}></div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8FAFC] p-4 rounded-xl mb-6 text-sm text-[#101D42] font-medium border border-gray-100">
              <Calendar size={18} className="text-[#2563EB]" />
              Prochain RDV : {startup.nextMeeting}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-full text-xs font-bold text-[#101D42] hover:bg-gray-50 transition-colors">
                <FileText size={16} /> DOSSIER
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#101D42] text-white py-3 rounded-full text-xs font-bold hover:bg-[#1a2b5e] transition-colors">
                <MessageCircle size={16} /> CHAT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}