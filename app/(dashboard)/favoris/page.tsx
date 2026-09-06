"use client";

import { Star, TrendingUp } from "lucide-react";

export default function FavorisPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Watchlist</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Startups en Favoris</h2>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 p-16 text-center shadow-sm">
        <Star size={48} className="mx-auto text-[#2563EB] mb-4 fill-[#EFF6FF]" />
        <h3 className="text-lg font-medium text-[#101D42] mb-2">Votre liste est vide</h3>
        <p className="text-[#9CA3AF] text-sm mb-6">Parcourez le Deal Flow pour ajouter des startups à surveiller.</p>
        <button className="bg-[#101D42] text-white px-6 py-3 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 mx-auto">
          <TrendingUp size={16} /> EXPLORER LE DEAL FLOW
        </button>
      </div>
    </div>
  );
}