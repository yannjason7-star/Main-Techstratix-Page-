"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Plus, MapPin, Video, Users, Loader2, X, MoreVertical } from "lucide-react";

type EventType = {
  id: string;
  title: string;
  type: string;
  event_date: string;
  event_time: string;
  mode: string;
  location: string;
  attendees: number;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Masterclass",
    event_date: "",
    event_time: "",
    mode: "En Ligne",
    location: ""
  });

  // Charger les événements au démarrage
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true }); // Du plus proche au plus lointain

      if (error) throw error;
      if (data) setEvents(data);
    } catch (error: any) {
      alert("❌ Erreur de chargement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([{
          title: formData.title,
          type: formData.type,
          event_date: formData.event_date,
          event_time: formData.event_time,
          mode: formData.mode,
          location: formData.location,
          attendees: 0 // Par défaut à la création
        }])
        .select();

      if (error) throw error;

      if (data) {
        // Ajout du nouvel événement et tri
        const newEvents = [...events, data[0]].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setEvents(newEvents);
        
        setIsModalOpen(false);
        setFormData({ title: "", type: "Masterclass", event_date: "", event_time: "", mode: "En Ligne", location: "" });
        alert("✅ Événement planifié avec succès !");
      }
    } catch (error: any) {
      alert("❌ Erreur de création : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour extraire le Jour et le Mois d'une date (Ex: "15 Jan")
  const formatDateForCard = (dateString: string) => {
    const dateObj = new Date(dateString);
    const day = dateObj.toLocaleDateString('fr-FR', { day: '2-digit' });
    const month = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    return { day, month };
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Calendrier</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Gestion des Événements</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} /> PLANIFIER UN ÉVÉNEMENT
        </button>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      {loading ? (
        <div className="flex justify-center py-20 text-[#2563EB]"><Loader2 className="animate-spin" size={32} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center text-[#9CA3AF] shadow-sm">
          <CalendarDays size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-[#101D42]">Le calendrier est vide.</p>
          <p className="text-sm mt-1">Planifiez votre premier événement pour l'écosystème.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const { day, month } = formatDateForCard(event.event_date);
            
            return (
              <div key={event.id} className="bg-white rounded-[24px] border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-[#2563EB]/40 transition-colors group relative">
                
                {/* Bouton Options (en haut à droite) */}
                <button className="absolute top-6 right-6 text-gray-300 hover:text-[#101D42] transition-colors hidden md:block">
                  <MoreVertical size={18} />
                </button>

                {/* Boîte de date */}
                <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shrink-0 group-hover:bg-[#101D42] group-hover:text-white transition-colors">
                  <span className="text-2xl font-bold">{day}</span>
                  <span className="text-xs uppercase tracking-widest font-medium opacity-80">{month}</span>
                </div>

                {/* Détails */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-bold tracking-[0.1em] text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full uppercase">
                    {event.type}
                  </span>
                  <h3 className="text-xl font-medium text-[#101D42] mt-2">{event.title}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-[#9CA3AF]">
                    <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {event.event_time}</span>
                    <span className="flex items-center gap-1.5">
                      {event.mode === 'En Ligne' ? <Video size={14} /> : <MapPin size={14} />} 
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Stats / Inscrits */}
                <div className="bg-gray-50 px-4 py-3 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[120px] md:mr-10">
                  <div className="flex items-center gap-2 text-[#101D42] font-bold text-lg mb-1">
                    <Users size={16} className="text-[#9CA3AF]" /> {event.attendees}
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#9CA3AF] tracking-wider">Inscrits</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================= */}
      {/* MODALE DE CRÉATION                        */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D42]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg"><CalendarDays size={20} /></div>
                <h3 className="text-lg font-bold text-[#101D42]">Planifier un Événement</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#101D42]"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-8 space-y-6">
              
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Titre de l'événement <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  placeholder="Ex: Masterclass Pitch Deck" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Type <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] bg-white"
                  >
                    <option value="Masterclass">Masterclass</option>
                    <option value="Networking">Networking</option>
                    <option value="Événement Majeur">Événement Majeur</option>
                    <option value="Atelier">Atelier Pratique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Mode <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] bg-white"
                  >
                    <option value="En Ligne">En Ligne (Visio)</option>
                    <option value="Présentiel">Présentiel</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" required 
                    value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Heure (GMT) <span className="text-red-500">*</span></label>
                  <input 
                    type="time" required 
                    value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Lieu ou Lien <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  placeholder={formData.mode === 'Présentiel' ? 'Ex: Hôtel Ivoire, Abidjan' : 'Ex: Lien Zoom / Google Meet'} 
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full font-bold tracking-wide text-gray-500 hover:bg-gray-100 transition-colors text-xs">
                  ANNULER
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-4 rounded-full font-bold tracking-wide text-white transition-colors text-xs flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 shadow-md">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : "PUBLIER L'ÉVÉNEMENT"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}