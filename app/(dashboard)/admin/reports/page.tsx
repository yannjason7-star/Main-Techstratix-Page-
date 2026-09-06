"use client";

import { FileText, Download, BarChart3, TrendingUp, DownloadCloud, Users } from "lucide-react";
const REPORTS_MOCK = [
  { id: 1, title: "Rapport d'Impact Annuel 2025", desc: "Statistiques complètes de création d'emploi et levées de fonds.", type: "PDF", size: "4.2 MB", date: "01 Jan 2026" },
  { id: 2, title: "Bilan Batch Été 2025", desc: "Performances et évaluations de la cohorte d'été.", type: "XLSX", size: "1.8 MB", date: "15 Dec 2025" },
  { id: 3, title: "Analyse d'Engagement LMS", desc: "Taux de complétion des formations en ligne.", type: "PDF", size: "2.1 MB", date: "01 Dec 2025" },
];

export default function AdminReportsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Export & Data</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Rapports d'Impact</h2>
        </div>
        <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm">
          <BarChart3 size={16} /> GÉNÉRER UN RAPPORT (TEMPS RÉEL)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#101D42] rounded-[24px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <TrendingUp size={24} className="mb-6 text-[#2563EB]" />
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Fonds levés (Cumulé)</p>
          <h3 className="text-4xl font-serif">€ 14.2M</h3>
        </div>
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-[24px] p-8">
          <Users size={24} className="mb-6 text-[#101D42]" />
          <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Emplois Créés</p>
          <h3 className="text-4xl font-serif text-[#101D42]">845+</h3>
        </div>
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-[24px] p-8">
          <FileText size={24} className="mb-6 text-[#101D42]" />
          <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Dossiers traités</p>
          <h3 className="text-4xl font-serif text-[#101D42]">1,204</h3>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8">
        <h3 className="text-lg font-medium text-[#101D42] mb-6">Archives des rapports</h3>
        <div className="space-y-4">
          {REPORTS_MOCK.map((report) => (
            <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[#101D42] shrink-0 shadow-sm">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#101D42]">{report.title}</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1">{report.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#101D42] uppercase">{report.type}</p>
                  <p className="text-xs text-[#9CA3AF]">{report.date} • {report.size}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors">
                  <DownloadCloud size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}