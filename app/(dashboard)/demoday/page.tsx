"use client";

import { Presentation, Calendar, Video, Download } from "lucide-react";

export default function DemoDayPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Événement Exclusif</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Le Grand Demo Day</h2>
      </div>

      <div className="bg-[#101D42] rounded-[32px] p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
          <div>
            <span className="inline-block bg-[#2563EB] text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-6">Bientôt</span>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-4">Batch Hiver 2026</h3>
            <p className="text-gray-400 mb-8 max-w-md">Découvrez les 10 startups les plus prometteuses de notre programme d'accélération qui pitchent en direct pour lever leur Seed.</p>
            
            <div className="flex gap-4">
              <button className="bg-white text-[#101D42] px-6 py-3.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <Video size={16} /> REJOINDRE LE LIVE
              </button>
              <button className="bg-transparent border border-gray-600 text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 hover:border-gray-400 transition-colors">
                <Download size={16} /> LIVRET DES STARTUPS
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shrink-0">
            <Calendar size={32} className="mx-auto mb-4 text-[#2563EB]" />
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-1">Mardi 15 Janvier</p>
            <p className="text-3xl font-serif mb-2">18:00 <span className="text-sm">GMT</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}