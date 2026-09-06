"use client";

import { CalendarDays, Plus, MapPin, Video, Users } from "lucide-react";

const EVENTS_MOCK = [
  { id: 1, title: "Demo Day - Batch Hiver 2026", type: "Événement Majeur", date: "15 Jan", time: "18:00 GMT", mode: "Présentiel", location: "Hôtel Ivoire, Abidjan", attendees: 120 },
  { id: 2, title: "Atelier Pitch Deck Parfait", type: "Masterclass", date: "20 Jan", time: "14:00 GMT", mode: "En Ligne", location: "Lien Zoom", attendees: 45 },
  { id: 3, title: "Rencontre Investisseurs Séries A", type: "Networking", date: "05 Fév", time: "19:00 GMT", mode: "Hybride", location: "Dakar & Zoom", attendees: 80 },
];

export default function AdminEventsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Calendrier</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Gestion des Événements</h2>
        </div>
        <button className="flex items-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm">
          <Plus size={16} /> PLANIFIER UN ÉVÉNEMENT
        </button>
      </div>

      <div className="space-y-6">
        {EVENTS_MOCK.map((event) => (
          <div key={event.id} className="bg-white rounded-[24px] border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-[#2563EB]/40 transition-colors cursor-pointer group">
            
            {/* Boîte de date */}
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shrink-0 group-hover:bg-[#101D42] group-hover:text-white transition-colors">
              <span className="text-2xl font-bold">{event.date.split(" ")[0]}</span>
              <span className="text-xs uppercase tracking-widest font-medium opacity-80">{event.date.split(" ")[1]}</span>
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.1em] text-[#2563EB] uppercase">{event.type}</span>
              <h3 className="text-xl font-medium text-[#101D42]">{event.title}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-[#9CA3AF]">
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {event.time}</span>
                <span className="flex items-center gap-1.5">
                  {event.mode === 'En Ligne' ? <Video size={14} /> : <MapPin size={14} />} 
                  {event.location}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[120px]">
              <div className="flex items-center gap-2 text-[#101D42] font-bold text-lg mb-1">
                <Users size={16} className="text-[#9CA3AF]" /> {event.attendees}
              </div>
              <span className="text-[10px] font-bold uppercase text-[#9CA3AF] tracking-wider">Inscrits</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}